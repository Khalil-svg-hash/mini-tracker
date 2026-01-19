import { IsString, IsNumber } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  name: string;

  @IsNumber()
  position: number;
}
