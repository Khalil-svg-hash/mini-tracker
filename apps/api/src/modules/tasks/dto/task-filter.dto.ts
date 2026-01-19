import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { TaskStatus, TaskPriority, TaskType } from '../../../entities/task.entity';

export class TaskFilterDto {
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @IsOptional()
  @IsUUID()
  assignee_id?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;
}
