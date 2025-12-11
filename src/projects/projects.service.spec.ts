import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma.service';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService, PrismaService],
    }).compile();

    service = module.get(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
