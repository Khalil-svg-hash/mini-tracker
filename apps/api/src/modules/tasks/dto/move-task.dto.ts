import { IsUUID, IsInt, Min } from 'class-validator';

export class MoveTaskDto {
  @IsUUID()
  column_id: string;

  @IsInt()
  @Min(0)
  position: number;
}
