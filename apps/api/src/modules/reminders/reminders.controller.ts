import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';

@Controller('api/v1/reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  async findAll(@Request() req) {
    return this.remindersService.findAll(req.user.id);
  }

  @Post()
  async create(@Body() createDto: CreateReminderDto, @Request() req) {
    return this.remindersService.create(createDto.task_id, req.user.id, createDto);
  }

  @Delete(':id')
  async cancel(@Param('id') id: string, @Request() req) {
    await this.remindersService.cancel(id, req.user.id);
    return { message: 'Reminder cancelled successfully' };
  }
}
