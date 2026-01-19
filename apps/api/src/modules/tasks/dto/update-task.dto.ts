import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsArray } from 'class-validator';
import { TaskStatus, TaskPriority, TaskType } from '../../../entities/task.entity';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

  @IsOptional()
  @IsUUID()
  assignee_id?: string;

  @IsOptional()
  @IsUUID()
  column_id?: string;

  @IsOptional()
  @IsDateString()
  due_date?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
