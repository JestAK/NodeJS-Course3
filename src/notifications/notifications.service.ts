import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  constructor(private readonly tasksService: TasksService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  checkDeadlines() {
    console.log('[Scheduler] Checking deadlines...');

    const overdue = this.tasksService.findOverdueTasks();

    if (overdue.length === 0) {
      console.log('[Scheduler] No overdue tasks.');
      return;
    }

    console.log('[Scheduler] Overdue tasks found:');
    overdue.forEach((task) => {
      console.log(
        `Task ${task.id} (episode ${task.episodeNumber}, type ${task.type}) is overdue.`,
      );
    });
  }
}
