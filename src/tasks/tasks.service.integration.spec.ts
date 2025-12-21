import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, PrismaService],
    }).compile();

    service = module.get(TasksService);
    prisma = module.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create initial tasks', async () => {
    await prisma.project.create({
      data: {
        id: 'project1',
        title: 'Test Project',
        totalEpisodes: 5,
      },
    });

    await service.createInitialTasks('project1', 5);

    const tasks = await prisma.task.findMany({
      where: { projectId: 'project1' },
    });

    expect(tasks.length).toBe(35);

    expect(tasks[0]).toMatchObject({
      projectId: 'project1',
      episodeNumber: 1,
      type: 'translation',
      status: 'todo',
      assignedTo: null,
      deadline: null,
    });
  });

  it('should get all tasks', async () => {
    await prisma.project.create({
      data: {
        id: 'project1',
        title: 'Test Project',
        totalEpisodes: 1,
      },
    });

    await prisma.task.create({
      data: {
        projectId: 'project1',
        episodeNumber: 1,
        type: 'translation',
        status: 'todo',
      },
    });

    const result = await service.getAll();

    expect(result.length).toBe(1);
  });

  it('should find task by id', async () => {
    await prisma.project.create({
      data: {
        id: 'project1',
        title: 'Test Project',
        totalEpisodes: 1,
      },
    });

    const task = await prisma.task.create({
      data: {
        projectId: 'project1',
        episodeNumber: 1,
        type: 'translation',
        status: 'todo',
      },
    });

    const result = await service.findOne(task.id);
    expect(result?.id).toBe(task.id);
  });

  it('should update task status', async () => {
    const project = await prisma.project.create({
      data: {
        id: 'project1',
        title: 'Test Project',
        totalEpisodes: 1,
      },
    });

    const task = await prisma.task.create({
      data: {
        projectId: project.id,
        episodeNumber: 1,
        type: 'translation',
        status: 'todo',
      },
    });

    const result = await service.updateStatus(task.id, 'in_progress');

    expect(result.status).toBe('in_progress');
  });

  it('should update task deadline', async () => {
    const newDate = new Date('2024-12-31');

    const project = await prisma.project.create({
      data: {
        id: 'project1',
        title: 'Test Project',
        totalEpisodes: 1,
      },
    });

    const task = await prisma.task.create({
      data: {
        projectId: project.id,
        episodeNumber: 1,
        type: 'translation',
        status: 'todo',
      },
    });

    const result = await service.updateDeadline(task.id, newDate);

    expect(result.deadline).toEqual(newDate);
  });

  it('should assign user to task', async () => {
    const project = await prisma.project.create({
      data: {
        id: 'project1',
        title: 'Test Project',
        totalEpisodes: 1,
      },
    });

    const task = await prisma.task.create({
      data: {
        projectId: project.id,
        episodeNumber: 1,
        type: 'translation',
        status: 'todo',
      },
    });

    const result = await service.assignUser(task.id, 'user1');

    expect(result?.assignedTo).toBe('user1');
  });

  it('should get project progress', async () => {
    await prisma.project.create({
      data: {
        id: 'project1',
        title: 'Test Project',
        totalEpisodes: 1,
      },
    });

    await prisma.task.createMany({
      data: [
        {
          projectId: 'project1',
          episodeNumber: 1,
          type: 'translation',
          status: 'done',
        },
        {
          projectId: 'project1',
          episodeNumber: 1,
          type: 'editing',
          status: 'todo',
        },
        {
          projectId: 'project1',
          episodeNumber: 2,
          type: 'editing',
          status: 'todo',
        },
        {
          projectId: 'project1',
          episodeNumber: 2,
          type: 'mixing',
          status: 'todo',
        },
      ],
    });

    const result = await service.getProjectProgress('project1');

    expect(result).toBe(0.25);
  });

  it('should get episode progress', async () => {
    await prisma.project.create({
      data: {
        id: 'project1',
        title: 'Test Project',
        totalEpisodes: 1,
      },
    });

    await prisma.task.createMany({
      data: [
        {
          projectId: 'project1',
          episodeNumber: 1,
          type: 'translation',
          status: 'done',
        },
        {
          projectId: 'project1',
          episodeNumber: 1,
          type: 'editing',
          status: 'todo',
        },
        {
          projectId: 'project1',
          episodeNumber: 2,
          type: 'editing',
          status: 'todo',
        },
      ],
    });

    const result = await service.getEpisodeProgress('project1', 1);

    expect(result).toBe(0.5);
  });

  it('should find overdue tasks', async () => {
    const pastDate = new Date('2000-01-01');
    const futureDate = new Date('2100-01-01');

    await prisma.project.create({
      data: {
        id: 'project1',
        title: 'Test Project',
        totalEpisodes: 1,
      },
    });

    await prisma.task.createMany({
      data: [
        {
          projectId: 'project1',
          episodeNumber: 1,
          type: 'translation',
          status: 'todo',
          deadline: pastDate,
        },
        {
          projectId: 'project1',
          episodeNumber: 1,
          type: 'editing',
          status: 'in_progress',
          deadline: pastDate,
        },
        {
          projectId: 'project1',
          episodeNumber: 1,
          type: 'mixing',
          status: 'done',
          deadline: pastDate,
        },
        {
          projectId: 'project1',
          episodeNumber: 1,
          type: 'quality_check',
          status: 'todo',
          deadline: futureDate,
        },
      ],
    });

    const result = await service.findOverdueTasks();

    expect(result.length).toBe(2);
  });
});
