import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Workspace } from '../../entities/workspace.entity';
import { WorkspaceMember, WorkspaceRole } from '../../entities/workspace-member.entity';
import { User } from '../../entities/user.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: string, createDto: CreateWorkspaceDto): Promise<Workspace> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const inviteCode = this.generateInviteCode();

    const workspace = this.workspaceRepository.create({
      ...createDto,
      owner_id: userId,
      invite_code: inviteCode,
    });

    const savedWorkspace = await this.workspaceRepository.save(workspace);

    await this.workspaceMemberRepository.save({
      workspace_id: savedWorkspace.id,
      user_id: userId,
      role: WorkspaceRole.OWNER,
    });

    return savedWorkspace;
  }

  async findAll(userId: string): Promise<Workspace[]> {
    const memberships = await this.workspaceMemberRepository.find({
      where: { user_id: userId },
      relations: ['workspace'],
    });

    return memberships.map((m) => m.workspace);
  }

  async findOne(id: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.checkUserAccess(id, userId);

    return workspace;
  }

  async update(id: string, userId: string, updateDto: UpdateWorkspaceDto): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.checkUserPermission(id, userId, [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]);

    Object.assign(workspace, updateDto);
    return this.workspaceRepository.save(workspace);
  }

  async delete(id: string, userId: string): Promise<void> {
    const workspace = await this.workspaceRepository.findOne({ where: { id } });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.checkUserPermission(id, userId, [WorkspaceRole.OWNER]);

    await this.workspaceRepository.remove(workspace);
  }

  async addMember(workspaceId: string, userId: string, role: WorkspaceRole): Promise<WorkspaceMember> {
    const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMember = await this.workspaceMemberRepository.findOne({
      where: { workspace_id: workspaceId, user_id: userId },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this workspace');
    }

    const member = this.workspaceMemberRepository.create({
      workspace_id: workspaceId,
      user_id: userId,
      role,
    });

    return this.workspaceMemberRepository.save(member);
  }

  async getMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return this.workspaceMemberRepository.find({
      where: { workspace_id: workspaceId },
      relations: ['user'],
    });
  }

  generateInviteCode(): string {
    return randomBytes(4).toString('hex');
  }

  async joinByInviteCode(code: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOne({
      where: { invite_code: code },
    });

    if (!workspace) {
      throw new NotFoundException('Invalid invite code');
    }

    const existingMember = await this.workspaceMemberRepository.findOne({
      where: { workspace_id: workspace.id, user_id: userId },
    });

    if (existingMember) {
      throw new ConflictException('You are already a member of this workspace');
    }

    await this.addMember(workspace.id, userId, WorkspaceRole.MEMBER);

    return workspace;
  }

  async regenerateInviteCode(workspaceId: string, userId: string): Promise<string> {
    const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await this.checkUserPermission(workspaceId, userId, [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]);

    const newCode = this.generateInviteCode();
    workspace.invite_code = newCode;
    await this.workspaceRepository.save(workspace);

    return newCode;
  }

  private async checkUserAccess(workspaceId: string, userId: string): Promise<void> {
    const member = await this.workspaceMemberRepository.findOne({
      where: { workspace_id: workspaceId, user_id: userId },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this workspace');
    }
  }

  private async checkUserPermission(
    workspaceId: string,
    userId: string,
    allowedRoles: WorkspaceRole[],
  ): Promise<void> {
    const member = await this.workspaceMemberRepository.findOne({
      where: { workspace_id: workspaceId, user_id: userId },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    if (!allowedRoles.includes(member.role)) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
  }
}
