import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '../../entities/board.entity';
import { BoardColumn } from '../../entities/board-column.entity';
import { Project } from '../../entities/project.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(BoardColumn)
    private boardColumnRepository: Repository<BoardColumn>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
  ) {}

  async create(projectId: string, userId: string, createDto: CreateBoardDto): Promise<Board> {
    await this.checkProjectAccess(projectId, userId);

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const board = this.boardRepository.create({
      ...createDto,
      project_id: projectId,
    });

    return this.boardRepository.save(board);
  }

  async findAll(projectId: string, userId: string): Promise<Board[]> {
    await this.checkProjectAccess(projectId, userId);

    return this.boardRepository.find({
      where: { project_id: projectId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: ['columns'],
      order: {
        columns: {
          position: 'ASC',
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.checkProjectAccess(board.project_id, userId);

    return board;
  }

  async update(id: string, userId: string, updateDto: UpdateBoardDto): Promise<Board> {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.checkProjectAccess(board.project_id, userId);

    Object.assign(board, updateDto);
    return this.boardRepository.save(board);
  }

  async delete(id: string, userId: string): Promise<void> {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.checkProjectAccess(board.project_id, userId);

    await this.boardRepository.remove(board);
  }

  async createColumn(boardId: string, userId: string, createDto: CreateColumnDto): Promise<BoardColumn> {
    await this.checkBoardAccess(boardId, userId);

    const existingColumn = await this.boardColumnRepository.findOne({
      where: { board_id: boardId, position: createDto.position },
    });

    if (existingColumn) {
      throw new BadRequestException('A column with this position already exists in the board');
    }

    const column = this.boardColumnRepository.create({
      ...createDto,
      board_id: boardId,
    });

    return this.boardColumnRepository.save(column);
  }

  async updateColumn(columnId: string, userId: string, updateDto: UpdateColumnDto): Promise<BoardColumn> {
    const column = await this.boardColumnRepository.findOne({ where: { id: columnId } });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    await this.checkBoardAccess(column.board_id, userId);

    if (updateDto.position !== undefined) {
      const existingColumn = await this.boardColumnRepository.findOne({
        where: { board_id: column.board_id, position: updateDto.position },
      });

      if (existingColumn && existingColumn.id !== columnId) {
        throw new BadRequestException('A column with this position already exists in the board');
      }
    }

    Object.assign(column, updateDto);
    return this.boardColumnRepository.save(column);
  }

  async deleteColumn(columnId: string, userId: string): Promise<void> {
    const column = await this.boardColumnRepository.findOne({ where: { id: columnId } });

    if (!column) {
      throw new NotFoundException('Column not found');
    }

    await this.checkBoardAccess(column.board_id, userId);

    await this.boardColumnRepository.remove(column);
  }

  async checkProjectAccess(projectId: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['workspace'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const member = await this.workspaceMemberRepository.findOne({
      where: { workspace_id: project.workspace_id, user_id: userId },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this project');
    }
  }

  async checkBoardAccess(boardId: string, userId: string): Promise<void> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.checkProjectAccess(board.project_id, userId);
  }
}
