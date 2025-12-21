import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';

describe('TasksService', () => {
  let service: TasksService;

  const prismaMock = {
    task: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findOne: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create initial tasks', async () => {
    await service.createInitialTasks('project1', 5);

    expect(prismaMock.task.createMany).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const createdTasks = prismaMock.task.createMany.mock.calls[0][0].data;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(createdTasks.length).toBe(35);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(createdTasks[0]).toEqual({
      projectId: 'project1',
      episodeNumber: 1,
      type: 'translation',
      status: 'todo',
      assignedTo: null,
      deadline: null,
    });
  });

  it('should get all tasks', async () => {
    prismaMock.task.findMany.mockResolvedValue([
      { id: 'task-1' },
      { id: 'task-2' },
    ]);

    const result = await service.getAll();

    expect(prismaMock.task.findMany).toHaveBeenCalledTimes(1);
    expect(result.length).toBe(2);
  });

  it('should find task by id', async () => {
    prismaMock.task.findUnique.mockResolvedValue({ id: 'task-1' });

    const result = await service.findOne('task-1');

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
      where: { id: 'task-1' },
    });
    expect(result?.id).toBe('task-1');
  });

  it('should update task status', async () => {
    prismaMock.task.update.mockResolvedValue({
      id: 'task-1',
      status: 'in_progress',
    });

    const result = await service.updateStatus('task-1', 'in_progress');

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { status: 'in_progress' },
    });
    expect(result.status).toBe('in_progress');
  });

  it('should update task deadline', async () => {
    const newDate = new Date('2024-12-31');
    prismaMock.task.update.mockResolvedValue({
      id: 'task-1',
      deadline: newDate,
    });

    const result = await service.updateDeadline('task-1', newDate);

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { deadline: newDate },
    });
    expect(result.deadline).toBe(newDate);
  });

  it('should assign user to task', async () => {
    prismaMock.task.findUnique.mockResolvedValue({
      id: 'task-1',
      assignedTo: null,
    });
    prismaMock.task.update.mockResolvedValue({
      id: 'task-1',
      assignedTo: 'user1',
    });

    const result = await service.assignUser('task-1', 'user1');

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({
      where: { id: 'task-1' },
    });
    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: { assignedTo: 'user1' },
    });
    expect(result?.assignedTo).toBe('user1');
  });

  it('should get project progress', async () => {
    prismaMock.task.count.mockResolvedValueOnce(10).mockResolvedValueOnce(7);

    const result = await service.getProjectProgress('project1');

    expect(prismaMock.task.count).toHaveBeenNthCalledWith(1, {
      where: { projectId: 'project1' },
    });
    expect(prismaMock.task.count).toHaveBeenNthCalledWith(2, {
      where: { projectId: 'project1', status: 'done' },
    });
    expect(result).toBe(0.7);
  });

  it('should get episode progress', async () => {
    prismaMock.task.count.mockResolvedValueOnce(10).mockResolvedValueOnce(7);

    const result = await service.getEpisodeProgress('project1', 1);

    expect(prismaMock.task.count).toHaveBeenNthCalledWith(1, {
      where: { projectId: 'project1', episodeNumber: 1 },
    });
    expect(prismaMock.task.count).toHaveBeenNthCalledWith(2, {
      where: { projectId: 'project1', episodeNumber: 1, status: 'done' },
    });
    expect(result).toBe(0.7);
  });

  it('should find overdue tasks', async () => {
    const overdueTasks = [
      { id: 'task-1', deadline: new Date('2024-01-01') },
      { id: 'task-2', deadline: new Date('2024-02-01') },
    ];
    prismaMock.task.findMany.mockResolvedValue(overdueTasks);

    const result = await service.findOverdueTasks();

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      where: {
        deadline: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          lt: expect.any(Date),
        },
        status: {
          not: 'done',
        },
      },
    });

    expect(result).toEqual(overdueTasks);
  });
});
