import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { TasksModule } from '../tasks/tasks.module';
import { ProjectsService } from './projects.service';
import { TasksService } from '../tasks/tasks.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TasksModule],
      controllers: [ProjectsController],
      providers: [ProjectsService, TasksService],
    }).compile();

    controller = module.get(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
