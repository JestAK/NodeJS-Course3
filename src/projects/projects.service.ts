import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { PrismaService } from '../prisma.service';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({ data: dto });
  }

  async findAll() {
    return this.prisma.project.findMany();
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }
}
