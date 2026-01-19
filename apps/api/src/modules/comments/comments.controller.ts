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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('api/v1')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('tasks/:tid/comments')
  async findAll(@Param('tid') taskId: string, @Request() req) {
    return this.commentsService.findAll(taskId, req.user.id);
  }

  @Post('tasks/:tid/comments')
  async create(
    @Param('tid') taskId: string,
    @Request() req,
    @Body() createDto: CreateCommentDto,
  ) {
    return this.commentsService.create(taskId, req.user.id, createDto);
  }

  @Patch('comments/:id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, req.user.id, updateDto);
  }

  @Delete('comments/:id')
  async delete(@Param('id') id: string, @Request() req) {
    await this.commentsService.delete(id, req.user.id);
    return { message: 'Comment deleted successfully' };
  }
}
