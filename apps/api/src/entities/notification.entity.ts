import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_MENTIONED = 'task_mentioned',
  COMMENT_MENTIONED = 'comment_mentioned',
  TASK_DUE_SOON = 'task_due_soon',
  TASK_UPDATED = 'task_updated',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @ManyToOne(() => Task, (task) => task.notifications, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ nullable: true })
  task_id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  read: boolean;

  @Column({ default: false })
  sent_via_bot: boolean;

  @CreateDateColumn()
  created_at: Date;
}
