import { IsString, IsEnum } from 'class-validator';
import { WorkspaceRole } from '../../../entities/workspace-member.entity';

export class AddMemberDto {
  @IsString()
  user_id: string;

  @IsEnum(WorkspaceRole)
  role: WorkspaceRole;
}
