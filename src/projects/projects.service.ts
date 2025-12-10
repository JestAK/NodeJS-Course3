import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        title: dto.title,
        totalEpisodes: dto.totalEpisodes,
      },
    });
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
