import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { BoardColumn } from '../../entities/board-column.entity';
import { User } from '../../entities/user.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';
import { ActivityLog } from '../../entities/activity-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      Project,
      BoardColumn,
      User,
      WorkspaceMember,
      ActivityLog,
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
