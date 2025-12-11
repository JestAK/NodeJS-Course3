import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from '../tasks/tasks.service';
import { PrismaService } from '../prisma.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      providers: [NotificationsService, TasksService, PrismaService],
    }).compile();

    service = module.get(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
