import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';
import { Task } from '../../entities/task.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    message: string,
    taskId?: string,
  ): Promise<Notification> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (taskId) {
      const task = await this.taskRepository.findOne({ where: { id: taskId } });
      if (!task) {
        throw new NotFoundException('Task not found');
      }
    }

    const notification = this.notificationRepository.create({
      user_id: userId,
      type,
      message,
      task_id: taskId,
      read: false,
    });

    return this.notificationRepository.save(notification);
  }

  async findAll(userId: string, unreadOnly?: boolean): Promise<Notification[]> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.task', 'task')
      .where('notification.user_id = :userId', { userId })
      .orderBy('notification.created_at', 'DESC');

    if (unreadOnly) {
      queryBuilder.andWhere('notification.read = :read', { read: false });
    }

    return queryBuilder.getMany();
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
      relations: ['task'],
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to update this notification');
    }

    notification.read = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true })
      .where('user_id = :userId', { userId })
      .andWhere('read = :read', { read: false })
      .execute();
  }
}
