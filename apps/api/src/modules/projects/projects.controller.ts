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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('api/v1')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('workspaces/:wid/projects')
  async findAll(@Param('wid') workspaceId: string, @Request() req) {
    return this.projectsService.findAll(workspaceId, req.user.id);
  }

  @Post('workspaces/:wid/projects')
  async create(
    @Param('wid') workspaceId: string,
    @Request() req,
    @Body() createDto: CreateProjectDto,
  ) {
    return this.projectsService.create(workspaceId, req.user.id, createDto);
  }

  @Get('projects/:id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Patch('projects/:id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, req.user.id, updateDto);
  }

  @Delete('projects/:id')
  async delete(@Param('id') id: string, @Request() req) {
    await this.projectsService.delete(id, req.user.id);
    return { message: 'Project deleted successfully' };
  }
}
