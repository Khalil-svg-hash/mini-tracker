import { IsUUID, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReminderDto {
  @IsUUID()
  task_id: string;

  @IsDateString()
  @Transform(({ value }) => {
    const date = new Date(value);
    if (date <= new Date()) {
      throw new Error('remind_at must be in the future');
    }
    return value;
  })
  remind_at: Date;
}
