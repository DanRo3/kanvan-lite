import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskStatusDto } from './dto/update-task.dto';
import { type User, TaskStatus } from '@prisma/client';
import { ProjectsService } from '../projects/project.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    // Check if user has access to the project
    const hasAccess = await this.projectsService.checkUserAccess(
      createTaskDto.projectId,
      user,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this project');
    }

    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        developers: {
          connect: { id: user.id },
        },
      },
      include: {
        project: true,
        developers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        developers: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if user has access to the project
    const hasAccess = await this.projectsService.checkUserAccess(
      task.projectId,
      user,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this project');
    }

    // Use transaction to update task status and project points
    return this.prisma.$transaction(async (prisma) => {
      const oldStatus = task.status;
      const newStatus = updateTaskStatusDto.status;

      // Update task status
      const updatedTask = await prisma.task.update({
        where: { id },
        data: { status: newStatus },
        include: {
          project: true,
          developers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Calculate points change
      let pointsChange = 0;

      // If task is moving to DEPLOYED, add points
      if (
        newStatus === TaskStatus.DEPLOYED &&
        oldStatus !== TaskStatus.DEPLOYED
      ) {
        pointsChange = task.points;
      }
      // If task is moving from DEPLOYED to another status, subtract points
      else if (
        oldStatus === TaskStatus.DEPLOYED &&
        newStatus !== TaskStatus.DEPLOYED
      ) {
        pointsChange = -task.points;
      }

      // Update project points if there's a change
      if (pointsChange !== 0) {
        await prisma.project.update({
          where: { id: task.projectId },
          data: {
            pointsUsed: {
              increment: pointsChange,
            },
          },
        });
      }

      return updatedTask;
    });
  }
}
