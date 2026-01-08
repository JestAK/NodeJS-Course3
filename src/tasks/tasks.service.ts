import { Injectable } from '@nestjs/common';
import { TaskStatus, TaskType } from './types/TasksTypes';
import { PrismaService } from '../prisma.service';
import { Task } from './types/TasksTypes';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private readonly processTypes: TaskType[] = [
    'translation',
    'editing',
    'casting',
    'recording',
    'correctionWriting',
    'correctionRecording',
    'mixing',
  ];

  async createInitialTasks(projectId: string, totalEpisodes: number) {
    const tasksToCreate: Task[] = [];

    for (let ep = 1; ep <= totalEpisodes; ep++) {
      for (const type of this.processTypes) {
        tasksToCreate.push({
          projectId,
          episodeNumber: ep,
          type,
          status: 'todo' as TaskStatus,
          assignedTo: null,
          deadline: null,
        });
      }
    }

    return await this.prisma.task.createMany({
      data: tasksToCreate,
    });
  }

  async getAll() {
    return await this.prisma.task.findMany({
      orderBy: { episodeNumber: 'asc' },
    });
  }

  async findOne(id: string) {
    return await this.prisma.task.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: TaskStatus) {
    return await this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  async updateDeadline(id: string, date: Date) {
    return await this.prisma.task.update({
      where: { id },
      data: { deadline: date },
    });
  }

  async assignUser(id: string, userName: string) {
    const task = await this.findOne(id);
    if (!task) return undefined;

    return this.prisma.task.update({
      where: { id },
      data: {
        assignedTo: userName,
      },
    });
  }

  async getProjectProgress(projectId: string) {
    const [total, completed] = await Promise.all([
      this.prisma.task.count({ where: { projectId } }),
      this.prisma.task.count({
        where: { projectId, status: 'done' },
      }),
    ]);

    if (total === 0) return undefined;
    return completed / total;
  }

  async getEpisodeProgress(projectId: string, episodeNumber: number) {
    const [total, completed] = await Promise.all([
      this.prisma.task.count({
        where: { projectId, episodeNumber },
      }),
      this.prisma.task.count({
        where: { projectId, episodeNumber, status: 'done' },
      }),
    ]);

    if (total === 0) return 0;
    return completed / total;
  }

  async findOverdueTasks() {
    const now = new Date();

    return await this.prisma.task.findMany({
      where: {
        deadline: { lt: now },
        status: { not: 'done' },
      },
    });
  }
}
