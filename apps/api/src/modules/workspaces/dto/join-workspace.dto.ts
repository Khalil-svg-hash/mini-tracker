import { IsString } from 'class-validator';

export class JoinWorkspaceDto {
  @IsString()
  invite_code: string;
}
