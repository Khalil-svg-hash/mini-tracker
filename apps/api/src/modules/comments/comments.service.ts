import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';
import { Task } from '../../entities/task.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { MentionsService } from '../mentions/mentions.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    private mentionsService: MentionsService,
  ) {}

  async create(taskId: string, userId: string, createDto: CreateCommentDto): Promise<Comment> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkTaskAccess(task.project.workspace_id, userId);

    if (createDto.parent_id) {
      const parent = await this.commentRepository.findOne({
        where: { id: createDto.parent_id },
      });
      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
      if (parent.task_id !== taskId) {
        throw new ForbiddenException('Parent comment does not belong to this task');
      }
    }

    const comment = this.commentRepository.create({
      ...createDto,
      task_id: taskId,
      author_id: userId,
    });

    const savedComment = await this.commentRepository.save(comment);

    await this.mentionsService.createMentionsForComment(
      savedComment.id,
      taskId,
      createDto.body,
    );

    return savedComment;
  }

  async findAll(taskId: string, userId: string): Promise<Comment[]> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['project'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.checkTaskAccess(task.project.workspace_id, userId);

    return this.commentRepository.find({
      where: { task_id: taskId },
      relations: ['author', 'parent'],
      order: { created_at: 'ASC' },
    });
  }

  async update(commentId: string, userId: string, updateDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['task', 'task.project'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author_id !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    await this.checkTaskAccess(comment.task.project.workspace_id, userId);

    Object.assign(comment, updateDto);
    return this.commentRepository.save(comment);
  }

  async delete(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['task', 'task.project'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author_id !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.checkTaskAccess(comment.task.project.workspace_id, userId);

    await this.commentRepository.remove(comment);
  }

  parseMentions(body: string): string[] {
    return this.mentionsService.parseMentionsFromText(body);
  }

  private async checkTaskAccess(workspaceId: string, userId: string): Promise<void> {
    const member = await this.workspaceMemberRepository.findOne({
      where: { workspace_id: workspaceId, user_id: userId },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this workspace');
    }
  }
}
