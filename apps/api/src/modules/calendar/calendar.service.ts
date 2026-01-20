import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
  ) {}

  async getTasksByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    projectId?: string,
  ): Promise<Task[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.reporter', 'reporter')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.column', 'column')
      .innerJoin('project.workspace', 'workspace')
      .innerJoin('workspace.members', 'member')
      .where('member.user_id = :userId', { userId })
      .andWhere('task.due_date IS NOT NULL')
      .andWhere('task.due_date BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (projectId) {
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: ['workspace'],
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const member = await this.workspaceMemberRepository.findOne({
        where: { workspace_id: project.workspace_id, user_id: userId },
      });

      if (!member) {
        throw new ForbiddenException('You do not have access to this workspace');
      }

      queryBuilder.andWhere('task.project_id = :projectId', { projectId });
    }

    queryBuilder.orderBy('task.due_date', 'ASC');

    return queryBuilder.getMany();
  }
}
