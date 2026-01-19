import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { Board } from '../../entities/board.entity';
import { BoardColumn } from '../../entities/board-column.entity';
import { User } from '../../entities/user.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';
import { ActivityLog } from '../../entities/activity-log.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { MoveTaskDto } from './dto/move-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(BoardColumn)
    private boardColumnRepository: Repository<BoardColumn>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async create(projectId: string, userId: string, createDto: CreateTaskDto): Promise<Task> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.checkProjectAccess(project.workspace_id, userId);

    if (createDto.column_id) {
      const column = await this.boardColumnRepository.findOne({
        where: { id: createDto.column_id },
        relations: ['board', 'board.project'],
      });
      if (!column) {
        throw new NotFoundException('Board column not found');
      }
      if (column.board.project.id !== projectId) {
        throw new ForbiddenException('Column does not belong to this project');
      }
    }

    if (createDto.assignee_id) {
      const assignee = await this.userRepository.findOne({ where: { id: createDto.assignee_id } });
      if (!assignee) {
        throw new NotFoundException('Assignee not found');
      }
      const isMember = await this.workspaceMemberRepository.findOne({
        where: { workspace_id: project.workspace_id, user_id: createDto.assignee_id },
      });
      if (!isMember) {
        throw new ForbiddenException('Assignee is not a member of this workspace');
      }
    }

    const task = this.taskRepository.create({
      ...createDto,
      project_id: projectId,
      reporter_id: userId,
    });

    const savedTask = await this.taskRepository.save(task);

    await this.logActivity(savedTask.id, userId, 'task_created', {
      title: savedTask.title,
    });

    return savedTask;
  }

  async findAll(filters: TaskFilterDto, userId: string): Promise<Task[]> {
    if (!filters.project_id) {
      throw new ForbiddenException('project_id filter is required');
    }

    const project = await this.projectRepository.findOne({ where: { id: filters.project_id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.checkProjectAccess(project.workspace_id, userId);

    const queryBuilder = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.reporter', 'reporter')
      .leftJoinAndSelect('task.column', 'column')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.project_id = :projectId', { projectId: filters.project_id });

    if (filters.assignee_id) {
      queryBuilder.andWhere('task.assignee_id = :assigneeId', { assigneeId: filters.assignee_id });
    }

    if (filters.status) {
      queryBuilder.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority: filters.priority });
    }

    if (filters.type) {
      queryBuilder.andWhere('task.type = :type', { type: filters.type });
    }

    queryBuilder.orderBy('task.position', 'ASC')
      .addOrderBy('task.created_at', 'DESC');

    return queryBuilder.getMany();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'reporter', 'column', 'project'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkTaskAccess(id, userId);

    return task;
  }

  async update(id: string, userId: string, updateDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id }, relations: ['project'] });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkTaskAccess(id, userId);

    if (updateDto.column_id) {
      const column = await this.boardColumnRepository.findOne({
        where: { id: updateDto.column_id },
        relations: ['board', 'board.project'],
      });
      if (!column) {
        throw new NotFoundException('Board column not found');
      }
      if (column.board.project.id !== task.project_id) {
        throw new ForbiddenException('Column does not belong to this project');
      }
    }

    if (updateDto.assignee_id) {
      const assignee = await this.userRepository.findOne({ where: { id: updateDto.assignee_id } });
      if (!assignee) {
        throw new NotFoundException('Assignee not found');
      }
      const isMember = await this.workspaceMemberRepository.findOne({
        where: { workspace_id: task.project.workspace_id, user_id: updateDto.assignee_id },
      });
      if (!isMember) {
        throw new ForbiddenException('Assignee is not a member of this workspace');
      }
    }

    const oldValues = { ...task };
    Object.assign(task, updateDto);
    const updatedTask = await this.taskRepository.save(task);

    const changes = this.getChanges(oldValues, updateDto);
    if (Object.keys(changes).length > 0) {
      await this.logActivity(task.id, userId, 'task_updated', changes);
    }

    return updatedTask;
  }

  async delete(id: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkTaskAccess(id, userId);

    await this.logActivity(task.id, userId, 'task_deleted', {
      title: task.title,
    });

    await this.taskRepository.remove(task);
  }

  async move(taskId: string, userId: string, moveDto: MoveTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkTaskAccess(taskId, userId);

    const column = await this.boardColumnRepository.findOne({
      where: { id: moveDto.column_id },
      relations: ['board', 'board.project'],
    });
    if (!column) {
      throw new NotFoundException('Board column not found');
    }
    if (column.board.project.id !== task.project_id) {
      throw new ForbiddenException('Column does not belong to this project');
    }

    const oldColumnId = task.column_id;
    const oldPosition = task.position;

    task.column_id = moveDto.column_id;
    task.position = moveDto.position;

    const updatedTask = await this.taskRepository.save(task);

    await this.logActivity(task.id, userId, 'task_moved', {
      from_column_id: oldColumnId,
      to_column_id: moveDto.column_id,
      from_position: oldPosition,
      to_position: moveDto.position,
    });

    return updatedTask;
  }

  async checkTaskAccess(taskId: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkProjectAccess(task.project.workspace_id, userId);
  }

  private async checkProjectAccess(workspaceId: string, userId: string): Promise<void> {
    const member = await this.workspaceMemberRepository.findOne({
      where: { workspace_id: workspaceId, user_id: userId },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this workspace');
    }
  }

  private async logActivity(taskId: string, userId: string, action: string, details: any): Promise<void> {
    const log = this.activityLogRepository.create({
      task_id: taskId,
      user_id: userId,
      action,
      details,
    });

    await this.activityLogRepository.save(log);
  }

  private getChanges(oldValues: any, newValues: any): any {
    const changes: any = {};
    const fieldsToTrack = ['title', 'description', 'status', 'priority', 'type', 'assignee_id', 'column_id', 'due_date', 'tags'];

    fieldsToTrack.forEach(field => {
      if (newValues[field] !== undefined && oldValues[field] !== newValues[field]) {
        changes[field] = {
          from: oldValues[field],
          to: newValues[field],
        };
      }
    });

    return changes;
  }
}
