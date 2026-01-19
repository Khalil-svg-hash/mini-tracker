import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { NotificationType } from '../../../entities/notification.entity';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  message: string;

  @IsOptional()
  @IsUUID()
  task_id?: string;
}
