import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './task.service';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskStatusDto } from './dto/update-task.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '@prisma/client';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const user = req.user as User;
    return this.tasksService.create(createTaskDto, user);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Request() req,
  ) {
    const user = req.user as User;
    return this.tasksService.updateStatus(id, updateTaskStatusDto, user);
  }
}
