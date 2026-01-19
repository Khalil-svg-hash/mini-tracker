import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JoinWorkspaceDto } from './dto/join-workspace.dto';

@Controller('api/v1/workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  async findAll(@Request() req) {
    return this.workspacesService.findAll(req.user.id);
  }

  @Post()
  async create(@Request() req, @Body() createDto: CreateWorkspaceDto) {
    return this.workspacesService.create(req.user.id, createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.workspacesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    await this.workspacesService.delete(id, req.user.id);
    return { message: 'Workspace deleted successfully' };
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string, @Request() req) {
    await this.workspacesService.findOne(id, req.user.id);
    return this.workspacesService.getMembers(id);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Request() req,
    @Body() addMemberDto: AddMemberDto,
  ) {
    await this.workspacesService.findOne(id, req.user.id);
    return this.workspacesService.addMember(id, addMemberDto.user_id, addMemberDto.role);
  }

  @Post(':id/invite')
  async generateInviteCode(@Param('id') id: string, @Request() req) {
    const newCode = await this.workspacesService.regenerateInviteCode(id, req.user.id);
    return { invite_code: newCode };
  }

  @Post('join')
  async joinByInviteCode(@Request() req, @Body() joinDto: JoinWorkspaceDto) {
    return this.workspacesService.joinByInviteCode(joinDto.invite_code, req.user.id);
  }
}
