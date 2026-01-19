import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { WorkspaceMember } from '../../workspaces/entities/workspace-member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint', unique: true })
  telegramId: number;

  @Column({ nullable: true, length: 64 })
  username: string;

  @Column({ length: 128 })
  firstName: string;

  @Column({ nullable: true, length: 128 })
  lastName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true, length: 10 })
  languageCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => WorkspaceMember, (member) => member.user)
  workspaceMemberships: WorkspaceMember[];
}