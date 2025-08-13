import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';
import { type User, Prisma, TaskStatus } from '@prisma/client';
import { ProjectsService } from '../projects/project.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user) {
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
          connect: { id: user.userId },
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

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { project: true, developers: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const hasAccess = await this.projectsService.checkUserAccess(
      task.projectId,
      user,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this project');
    }

    let developersUpdate: Prisma.TaskUpdateInput['developers'] | undefined =
      undefined;
    if (updateTaskDto.developerIds) {
      developersUpdate = {
        set: updateTaskDto.developerIds.map((id) => ({ id })),
      };
    }

    const dataUpdate = {
      title: updateTaskDto.title,
      points: updateTaskDto.points,
      developmentHours: updateTaskDto.developmentHours,
      status: updateTaskDto.status,
      ...(developersUpdate ? { developers: developersUpdate } : {}),
    };

    return this.prisma.task.update({
      where: { id },
      data: dataUpdate,
      include: {
        project: true,
        developers: {
          select: { id: true, name: true, email: true },
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

    const hasAccess = await this.projectsService.checkUserAccess(
      task.projectId,
      user,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this project');
    }

    return this.prisma.$transaction(async (prisma) => {
      const oldStatus = task.status;
      const newStatus = updateTaskStatusDto.status;

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

      let pointsChange = 0;

      if (
        newStatus === TaskStatus.DEPLOYED &&
        oldStatus !== TaskStatus.DEPLOYED
      ) {
        pointsChange = task.points;
      } else if (
        oldStatus === TaskStatus.DEPLOYED &&
        newStatus !== TaskStatus.DEPLOYED
      ) {
        pointsChange = -task.points;
      }

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

  async findAllByProject(projectId: string, user: User) {
    // Verificar acceso del usuario al proyecto
    const hasAccess = await this.projectsService.checkUserAccess(
      projectId,
      user,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this project');
    }

    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        developers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });
  }

  async remove(id: string, user: User) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const hasAccess = await this.projectsService.checkUserAccess(
      task.projectId,
      user,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Access denied to this project');
    }

    // Opcional: si el task estaba en status DEPLOYED, descontar puntos
    if (task.status === TaskStatus.DEPLOYED) {
      await this.prisma.project.update({
        where: { id: task.projectId },
        data: {
          pointsUsed: {
            decrement: task.points,
          },
        },
      });
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
