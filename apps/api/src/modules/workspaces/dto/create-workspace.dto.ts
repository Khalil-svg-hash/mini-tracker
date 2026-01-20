import { IsString, IsOptional, IsArray, IsInt, Min } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  default_columns?: string[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  working_days?: number[];

  @IsOptional()
  @IsInt()
  @Min(0)
  default_reminder_offset?: number;
}
