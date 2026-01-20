import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from '../../entities/activity-log.entity';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
  ) {}

  async logActivity(
    taskId: string,
    userId: string,
    action: string,
    details?: any,
  ): Promise<ActivityLog> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const log = this.activityLogRepository.create({
      task_id: taskId,
      user_id: userId,
      action,
      details,
    });

    return this.activityLogRepository.save(log);
  }

  async getTaskActivity(taskId: string, userId: string): Promise<ActivityLog[]> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const member = await this.workspaceMemberRepository.findOne({
      where: { workspace_id: task.project.workspace_id, user_id: userId },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    return this.activityLogRepository.find({
      where: { task_id: taskId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }
}
