import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TasksModule, ScheduleModule.forRoot()],
  providers: [NotificationsService],
})
export class NotificationsModule {}
