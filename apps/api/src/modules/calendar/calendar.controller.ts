import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import { CalendarQueryDto } from './dto/calendar-query.dto';

@Controller('api/v1/calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  async getCalendarTasks(@Query() query: CalendarQueryDto, @Request() req) {
    const startDate = new Date(query.start_date);
    const endDate = new Date(query.end_date);

    return this.calendarService.getTasksByDateRange(
      req.user.id,
      startDate,
      endDate,
      query.project_id,
    );
  }
}
