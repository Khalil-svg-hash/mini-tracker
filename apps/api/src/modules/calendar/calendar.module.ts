import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { Task } from '../../entities/task.entity';
import { Project } from '../../entities/project.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Project, WorkspaceMember]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
