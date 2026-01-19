import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board } from '../../entities/board.entity';
import { BoardColumn } from '../../entities/board-column.entity';
import { Project } from '../../entities/project.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, BoardColumn, Project, WorkspaceMember])],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
