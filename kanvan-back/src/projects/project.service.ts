import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateProjectDto } from './dto/create-project.dto';
import { type User, UserRole } from '@prisma/client';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    // if (user.role !== UserRole.OWNER) {
    //   throw new ForbiddenException('Only owners can create projects');
    // }

    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        deadline: new Date(createProjectDto.deadline),
        ownerId: user.id,
        criticalBugs: 0,
        normalBugs: 0,
        lowBugs: 0,
        testsCoberage: 0,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        developers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: true,
        risks: true,
      },
    });
  }

  async findAll(user: User) {
    if (user.role === UserRole.OWNER) {
      return this.prisma.project.findMany({
        where: {
          ownerId: user.id,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          developers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tasks: true,
          risks: true,
        },
      });
    } else {
      return this.prisma.project.findMany({
        where: {
          developers: {
            some: {
              id: user.id,
            },
          },
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          developers: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tasks: true,
          risks: true,
        },
      });
    }
  }

  async findByPublicId(publicId: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        publicId,
      },
      select: {
        id: true,
        publicId: true,
        name: true,
        description: true,
        status: true,
        pointsBudget: true,
        pointsUsed: true,
        deadline: true,
        createdAt: true,
        updatedAt: true,
        criticalBugs: true,
        normalBugs: true,
        lowBugs: true,
        testsCoberage: true,
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            points: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        risks: {
          select: {
            id: true,
            name: true,
            scope: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async checkUserAccess(projectId: string, user: User): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        developers: true,
      },
    });

    if (!project) {
      return false;
    }

    if (user.role === UserRole.OWNER && project.ownerId === user.id) {
      return true;
    }

    if (user.role === UserRole.DEVELOPER) {
      return project.developers.some((dev) => dev.id === user.id);
    }

    return false;
  }

  async update(
    projectId: string,
    updateProjectDto: UpdateProjectDto,
    user: User,
  ) {
    // Verificar que el proyecto existe
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Validar permisos del usuario: solo Owner puede actualizar su proyecto
    if (user.role !== UserRole.OWNER || project.ownerId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to update this project',
      );
    }

    // Actualiza el proyecto, si viene deadline lo convierte a Date
    const dataToUpdate = {
      ...updateProjectDto,
      ...(updateProjectDto.deadline
        ? { deadline: new Date(updateProjectDto.deadline) }
        : {}),
    };

    return this.prisma.project.update({
      where: { id: projectId },
      data: dataToUpdate,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        developers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: true,
        risks: true,
      },
    });
  }
}
