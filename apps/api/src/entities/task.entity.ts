import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BoardColumn } from './board-column.entity';
import { Project } from './project.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Mention } from './mention.entity';
import { Notification } from './notification.entity';
import { Reminder } from './reminder.entity';
import { ActivityLog } from './activity-log.entity';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskType {
  TASK = 'task',
  BUG = 'bug',
  FEATURE = 'feature',
  STORY = 'story',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => BoardColumn, (column) => column.tasks, { nullable: true })
  @JoinColumn({ name: 'column_id' })
  column: BoardColumn;

  @Column({ nullable: true })
  column_id: string;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  project_id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.TASK,
  })
  type: TaskType;

  @ManyToOne(() => User, (user) => user.assigned_tasks, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @Column({ nullable: true })
  assignee_id: string;

  @ManyToOne(() => User, (user) => user.reported_tasks)
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @Column()
  reporter_id: string;

  @Column({ type: 'timestamp', nullable: true })
  due_date: Date;

  @Column({ type: 'jsonb', default: '[]' })
  tags: string[];

  @Column({ type: 'int', default: 0 })
  position: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @OneToMany(() => Mention, (mention) => mention.task)
  mentions: Mention[];

  @OneToMany(() => Notification, (notification) => notification.task)
  notifications: Notification[];

  @OneToMany(() => Reminder, (reminder) => reminder.task)
  reminders: Reminder[];

  @OneToMany(() => ActivityLog, (log) => log.task)
  activity_logs: ActivityLog[];
}
