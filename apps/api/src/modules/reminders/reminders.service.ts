import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Reminder, ReminderStatus } from '../../entities/reminder.entity';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';
import { CreateReminderDto } from './dto/create-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
  ) {}

  async create(taskId: string, userId: string, createDto: CreateReminderDto): Promise<Reminder> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkTaskAccess(task.project.workspace_id, userId);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reminder = this.reminderRepository.create({
      task_id: taskId,
      user_id: userId,
      remind_at: createDto.remind_at,
      status: ReminderStatus.PENDING,
    });

    return await this.reminderRepository.save(reminder);
  }

  async findAll(userId: string): Promise<Reminder[]> {
    return await this.reminderRepository.find({
      where: { user_id: userId },
      relations: ['task'],
      order: { remind_at: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Reminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id },
      relations: ['task', 'task.project'],
    });

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    if (reminder.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this reminder');
    }

    return reminder;
  }

  async cancel(id: string, userId: string): Promise<void> {
    const reminder = await this.findOne(id, userId);

    reminder.status = ReminderStatus.CANCELLED;
    await this.reminderRepository.save(reminder);
  }

  async processPendingReminders(): Promise<void> {
    const now = new Date();
    const pendingReminders = await this.reminderRepository.find({
      where: {
        remind_at: LessThanOrEqual(now),
        status: ReminderStatus.PENDING,
      },
      relations: ['task', 'user'],
    });

    for (const reminder of pendingReminders) {
      reminder.status = ReminderStatus.SENT;
      await this.reminderRepository.save(reminder);
    }
  }

  private async checkTaskAccess(workspaceId: string, userId: string): Promise<void> {
    const membership = await this.workspaceMemberRepository.findOne({
      where: { workspace_id: workspaceId, user_id: userId },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace');
    }
  }
}
