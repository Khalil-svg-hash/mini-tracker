import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mention, MentionContext } from '../../entities/mention.entity';
import { User } from '../../entities/user.entity';
import { Task } from '../../entities/task.entity';
import { Comment } from '../../entities/comment.entity';

@Injectable()
export class MentionsService {
  constructor(
    @InjectRepository(Mention)
    private mentionRepository: Repository<Mention>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createMentionsForComment(commentId: string, taskId: string, body: string): Promise<Mention[]> {
    const usernames = this.parseMentionsFromText(body);
    if (usernames.length === 0) {
      return [];
    }

    const users = await this.findUsersByUsernames(usernames);
    const mentions: Mention[] = [];

    for (const user of users) {
      const mention = this.mentionRepository.create({
        context: MentionContext.COMMENT,
        comment_id: commentId,
        task_id: taskId,
        mentioned_user_id: user.id,
        notified: false,
      });
      mentions.push(await this.mentionRepository.save(mention));
    }

    return mentions;
  }

  async createMentionsForTask(taskId: string, description: string): Promise<Mention[]> {
    const usernames = this.parseMentionsFromText(description);
    if (usernames.length === 0) {
      return [];
    }

    const users = await this.findUsersByUsernames(usernames);
    const mentions: Mention[] = [];

    for (const user of users) {
      const mention = this.mentionRepository.create({
        context: MentionContext.TASK,
        task_id: taskId,
        mentioned_user_id: user.id,
        notified: false,
      });
      mentions.push(await this.mentionRepository.save(mention));
    }

    return mentions;
  }

  parseMentionsFromText(text: string): string[] {
    if (!text) {
      return [];
    }

    const mentionRegex = /@(\w+)/g;
    const matches = text.matchAll(mentionRegex);
    const usernames = new Set<string>();

    for (const match of matches) {
      usernames.add(match[1]);
    }

    return Array.from(usernames);
  }

  async findUsersByUsernames(usernames: string[]): Promise<User[]> {
    if (usernames.length === 0) {
      return [];
    }

    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username IN (:...usernames)', { usernames })
      .getMany();
  }
}
