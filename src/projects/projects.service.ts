import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { randomUUID } from 'crypto';
import { Project } from './types/ProjectsTypes';

@Injectable()
export class ProjectsService {
  private projects: Project[] = [];

  create(dto: CreateProjectDto): Project {
    const project: Project = {
      id: randomUUID(),
      title: dto.title,
      totalEpisodes: dto.totalEpisodes,
      createdAt: new Date(),
    };

    this.projects.push(project);
    return project;
  }

  findAll(): Project[] {
    return this.projects;
  }

  findOne(id: string): Project | undefined {
    return this.projects.find((project) => project.id === id);
  }
}
