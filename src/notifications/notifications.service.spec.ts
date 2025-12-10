import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { TasksModule } from '../tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TasksModule, ScheduleModule.forRoot()],
      providers: [NotificationsService],
    }).compile();

    service = module.get(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
