import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('api/v1')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get('projects/:pid/boards')
  async findAll(@Param('pid') projectId: string, @Request() req) {
    return this.boardsService.findAll(projectId, req.user.id);
  }

  @Post('projects/:pid/boards')
  async create(
    @Param('pid') projectId: string,
    @Request() req,
    @Body() createDto: CreateBoardDto,
  ) {
    return this.boardsService.create(projectId, req.user.id, createDto);
  }

  @Get('boards/:id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.boardsService.findOne(id, req.user.id);
  }

  @Patch('boards/:id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateBoardDto,
  ) {
    return this.boardsService.update(id, req.user.id, updateDto);
  }

  @Delete('boards/:id')
  async delete(@Param('id') id: string, @Request() req) {
    await this.boardsService.delete(id, req.user.id);
    return { message: 'Board deleted successfully' };
  }

  @Post('boards/:bid/columns')
  async createColumn(
    @Param('bid') boardId: string,
    @Request() req,
    @Body() createDto: CreateColumnDto,
  ) {
    return this.boardsService.createColumn(boardId, req.user.id, createDto);
  }

  @Patch('columns/:id')
  async updateColumn(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateColumnDto,
  ) {
    return this.boardsService.updateColumn(id, req.user.id, updateDto);
  }

  @Delete('columns/:id')
  async deleteColumn(@Param('id') id: string, @Request() req) {
    await this.boardsService.deleteColumn(id, req.user.id);
    return { message: 'Column deleted successfully' };
  }
}
