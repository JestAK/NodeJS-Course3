import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TasksModule } from '../tasks/tasks.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [TasksModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
})
export class ProjectsModule {}
