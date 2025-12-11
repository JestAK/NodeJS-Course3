import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskStatusDto } from './dto/UpdateTask.dto';
import { AssignTaskDto } from './dto/AssignTask.dto';
import { UpdateTaskDeadlineDto } from './dto/UpdateDeadkine.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAll() {
    return await this.tasksService.getAll();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return await this.tasksService.updateStatus(id, dto.status);
  }

  @Patch(':id/deadline')
  async updateDeadline(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDeadlineDto,
  ) {
    return await this.tasksService.updateDeadline(id, dto.deadline);
  }

  @Patch(':id/assign')
  async assign(@Param('id') id: string, @Body() dto: AssignTaskDto) {
    return await this.tasksService.assignUser(id, dto.userName);
  }
}
