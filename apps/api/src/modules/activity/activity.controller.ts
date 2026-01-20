import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ActivityService } from './activity.service';

@Controller('api/v1/tasks')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get(':tid/activity')
  async getTaskActivity(@Param('tid') taskId: string, @Request() req) {
    return this.activityService.getTaskActivity(taskId, req.user.id);
  }
}
