import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskStatusDto } from './dto/UpdateTask.dto';
import { AssignTaskDto } from './dto/AssignTask.dto';
import {UpdateTaskDeadlineDto} from "./dto/UpdateDeadkine.dto";

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll() {
    return this.tasksService.getAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskStatusDto) {
    return this.tasksService.updateStatus(id, dto.status);
  }

  @Patch(':id/deadline')
  updateDeadline(@Param('id') id: string, @Body() dto: UpdateTaskDeadlineDto) {
    return this.tasksService.updateDeadline(id, dto.deadline);
  }

  @Patch(':id/assign')
  assign(@Param('id') id: string, @Body() dto: AssignTaskDto) {
    return this.tasksService.assignUser(id, dto.userName);
  }
}
