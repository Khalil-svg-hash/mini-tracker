import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { WorkspaceMember } from './workspace-member.entity';
import { Task } from './task.entity';
import { Comment } from './comment.entity';
import { Mention } from './mention.entity';
import { Notification } from './notification.entity';
import { Reminder } from './reminder.entity';
import { ActivityLog } from './activity-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'bigint' })
  telegram_id: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  language_code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => WorkspaceMember, (member) => member.user)
  workspace_memberships: WorkspaceMember[];

  @OneToMany(() => Task, (task) => task.assignee)
  assigned_tasks: Task[];

  @OneToMany(() => Task, (task) => task.reporter)
  reported_tasks: Task[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Mention, (mention) => mention.mentioned_user)
  mentions: Mention[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Reminder, (reminder) => reminder.user)
  reminders: Reminder[];

  @OneToMany(() => ActivityLog, (log) => log.user)
  activity_logs: ActivityLog[];
}
