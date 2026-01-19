import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';
import { Comment } from './comment.entity';
import { User } from './user.entity';

export enum MentionContext {
  TASK = 'task',
  COMMENT = 'comment',
}

@Entity('mentions')
export class Mention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MentionContext,
  })
  context: MentionContext;

  @ManyToOne(() => Task, (task) => task.mentions, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ nullable: true })
  task_id: string;

  @ManyToOne(() => Comment, (comment) => comment.mentions, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @Column({ nullable: true })
  comment_id: string;

  @ManyToOne(() => User, (user) => user.mentions)
  @JoinColumn({ name: 'mentioned_user_id' })
  mentioned_user: User;

  @Column()
  mentioned_user_id: string;

  @Column({ default: false })
  notified: boolean;

  @CreateDateColumn()
  created_at: Date;
}
