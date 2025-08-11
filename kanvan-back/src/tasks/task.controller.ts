import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User, UserRole } from '@prisma/client';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @ApiBody({ type: CreateTaskDto })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const user = req.user as User;
    return this.tasksService.create(createTaskDto, user);
  }

  // Actualizar task completo (incluye status)
  @Patch(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @ApiBody({ type: UpdateTaskDto })
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    const user = req.user as User;
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  // Solo actualizar status (por developer)
  @Patch(':id/status')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DEVELOPER, UserRole.OWNER)
  @ApiBody({ type: UpdateTaskStatusDto })
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Request() req,
  ) {
    const user = req.user as User;
    return this.tasksService.updateStatus(id, updateTaskStatusDto, user);
  }

  // Obtener todas las tareas de un proyecto
  @Get('project/:projectId')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.DEVELOPER)
  findAllByProject(@Param('projectId') projectId: string, @Request() req) {
    const user = req.user as User;
    return this.tasksService.findAllByProject(projectId, user);
  }

  // Borrar tarea
  @Delete(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  remove(@Param('id') id: string, @Request() req) {
    const user = req.user as User;
    return this.tasksService.remove(id, user);
  }
}
