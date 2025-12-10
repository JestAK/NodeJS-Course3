import { Injectable } from '@nestjs/common';
import { Task, TaskStatus, TaskType } from './types/TasksTypes';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  private readonly processTypes: TaskType[] = [
    'translation',
    'editing',
    'casting',
    'recording',
    'correctionWriting',
    'correctionRecording',
    'mixing',
  ];

  createInitialTasks(projectId: string, totalEpisodes: number): Task[] {
    const created: Task[] = [];

    for (let ep = 1; ep <= totalEpisodes; ep++) {
      for (const type of this.processTypes) {
        const task: Task = {
          id: randomUUID(),
          projectId,
          episodeNumber: ep,
          type,
          status: 'todo',
          assignedTo: null,
          deadline: null,
        };
        this.tasks.push(task);
        created.push(task);
      }
    }

    return created;
  }

  getAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  updateStatus(id: string, status: TaskStatus): Task | undefined {
    const task = this.findOne(id);
    if (!task) {
      return undefined;
    }
    task.status = status;
    return task;
  }

  updateDeadline(id: string, date: Date): Task | undefined {
    const task = this.findOne(id);
    if (!task) {
      return undefined;
    }
    task.deadline = date;
    return task;
  }

  assignUser(id: string, userName: string): Task | undefined {
    const task = this.findOne(id);
    if (!task) {
      return undefined;
    }
    task.assignedTo = userName;
    if (task.status === 'todo') {
      task.status = 'in_progress';
    }
    return task;
  }

  getProjectProgress(projectId: string): number | undefined {
    const projectTasks = this.tasks.filter(
      (task) => task.projectId === projectId,
    );
    if (projectTasks.length === 0) return undefined;

    const completed = projectTasks.filter(
      (task) => task.status === 'done',
    ).length;
    return completed / projectTasks.length;
  }

  getEpisodeProgress(projectId: string, episodeNumber: number): number {
    const episodeTasks = this.tasks.filter(
      (task) =>
        task.projectId === projectId && task.episodeNumber === episodeNumber,
    );
    if (episodeTasks.length === 0) return 0;

    const completed = episodeTasks.filter(
      (task) => task.status === 'done',
    ).length;
    return completed / episodeTasks.length;
  }

  findOverdueTasks(): Task[] {
    const now: Date = new Date();
    return this.tasks.filter(
      (task) =>
        task.deadline !== null && task.deadline < now && task.status !== 'done',
    );
  }
}
