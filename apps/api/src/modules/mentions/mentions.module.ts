import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentionsService } from './mentions.service';
import { Mention } from '../../entities/mention.entity';
import { User } from '../../entities/user.entity';
import { Task } from '../../entities/task.entity';
import { Comment } from '../../entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mention,
      User,
      Task,
      Comment,
    ]),
  ],
  providers: [MentionsService],
  exports: [MentionsService],
})
export class MentionsModule {}
