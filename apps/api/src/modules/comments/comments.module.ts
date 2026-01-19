import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from '../../entities/comment.entity';
import { Task } from '../../entities/task.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';
import { MentionsModule } from '../mentions/mentions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment,
      Task,
      WorkspaceMember,
    ]),
    MentionsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
