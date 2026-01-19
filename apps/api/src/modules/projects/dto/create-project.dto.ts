import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ProjectVisibility } from '../../../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectVisibility)
  visibility?: ProjectVisibility;
}
