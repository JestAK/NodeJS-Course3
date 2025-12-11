import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateProjectDto } from './dto/CreateProject.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    const project = await this.projectsService.create(dto);
    this.tasksService.createInitialTasks(project.id, project.totalEpisodes);
    return project;
  }

  @Get()
  async findAll() {
    return await this.projectsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectsService.findOne(id);
  }

  @Get(':id/progress')
  getProjectProgress(@Param('id') id: string) {
    return {
      projectId: id,
      progress: this.tasksService.getProjectProgress(id),
    };
  }

    @Get(':id/episodes/:episodeNumber/progress')
    getEpisodeProgress(
      @Param('id') id: string,
      @Param('episodeNumber') episodeNumber: string,
    ) {
      const ep = parseInt(episodeNumber, 10);
      return {
        projectId: id,
        episodeNumber: ep,
        progress: this.tasksService.getEpisodeProgress(id, ep),
      };
    }
}
