import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { MoveTaskDto } from './dto/move-task.dto';

@Controller('api/v1/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Query() filters: TaskFilterDto, @Request() req) {
    return this.tasksService.findAll(filters, req.user.id);
  }

  @Post()
  async create(@Body() createDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createDto.project_id, req.user.id, createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    await this.tasksService.delete(id, req.user.id);
    return { message: 'Task deleted successfully' };
  }

  @Patch(':id/move')
  async move(
    @Param('id') id: string,
    @Request() req,
    @Body() moveDto: MoveTaskDto,
  ) {
    return this.tasksService.move(id, req.user.id, moveDto);
  }
}
