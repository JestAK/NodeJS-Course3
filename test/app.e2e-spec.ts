import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.e2e' });

describe('E2E Tests', () => {
  let app: INestApplication;
  let projectId: string;
  let taskId: string;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    prisma = module.get(PrismaService);

    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /projects', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .post('/projects')
      .send({ title: 'SomeName', totalEpisodes: 5 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    projectId = res.body.id;
  });

  it('GET /projects', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer()).get('/projects');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /projects/:id', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer()).get(
      `/projects/${projectId}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', projectId);
  });

  it('GET /tasks', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer()).get('/tasks');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    taskId = res.body[0]?.id;
  });

  it('PATCH /tasks/:id/status', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/status`)
      .send({ status: 'done' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', taskId);
    expect(res.body).toHaveProperty('status', 'done');
  });

  it('PATCH /tasks/:id/deadline', async () => {
    const newDeadline = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/deadline`)
      .send({ deadline: newDeadline });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', taskId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    expect(new Date(res.body.deadline).toISOString()).toBe(newDeadline);
  });

  it('PATCH /tasks/:id/assign', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/assign`)
      .send({ userName: 'John Doe' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', taskId);
    expect(res.body).toHaveProperty('assignedTo', 'John Doe');
  });

  it('GET /projects/:id/progress', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer()).get(
      `/projects/${projectId}/progress`,
    );

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty('projectId', projectId);
    expect(res.body).toHaveProperty('progress', expect.any(Number));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body.progress).toBeCloseTo(1 / 35, 5);
  });

  it('GET /projects/:id/episodes/:episodeNumber/progress', async () => {
    const episodeNumber = 1;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer()).get(
      `/projects/${projectId}/episodes/${episodeNumber}/progress`,
    );

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty('projectId', projectId);
    expect(res.body).toHaveProperty('episodeNumber', episodeNumber);
    expect(res.body).toHaveProperty('progress', expect.any(Number));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body.progress).toBeCloseTo(1 / 7, 5);
  });
});
