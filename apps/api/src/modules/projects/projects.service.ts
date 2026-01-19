import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Workspace } from '../../entities/workspace.entity';
import { WorkspaceMember } from '../../entities/workspace-member.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
  ) {}

  async create(workspaceId: string, userId: string, createDto: CreateProjectDto): Promise<Project> {
    await this.checkWorkspaceAccess(workspaceId, userId);

    const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const project = this.projectRepository.create({
      ...createDto,
      workspace_id: workspaceId,
    });

    return this.projectRepository.save(project);
  }

  async findAll(workspaceId: string, userId: string): Promise<Project[]> {
    await this.checkWorkspaceAccess(workspaceId, userId);

    return this.projectRepository.find({
      where: { workspace_id: workspaceId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['workspace'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.checkWorkspaceAccess(project.workspace_id, userId);

    return project;
  }

  async update(id: string, userId: string, updateDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.checkWorkspaceAccess(project.workspace_id, userId);

    Object.assign(project, updateDto);
    return this.projectRepository.save(project);
  }

  async delete(id: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.checkWorkspaceAccess(project.workspace_id, userId);

    await this.projectRepository.remove(project);
  }

  async checkWorkspaceAccess(workspaceId: string, userId: string): Promise<void> {
    const member = await this.workspaceMemberRepository.findOne({
      where: { workspace_id: workspaceId, user_id: userId },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this workspace');
    }
  }
}
