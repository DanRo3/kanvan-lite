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

  async create(createProjectDto: CreateProjectDto, user) {
    // if (user.role !== UserRole.OWNER) {
    //   throw new ForbiddenException('Only owners can create projects');
    // }

    console.log(user);

    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        deadline: new Date(createProjectDto.deadline),
        ownerId: user.userId,
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

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
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

  async checkUserAccess(projectId: string, user): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        developers: true,
      },
    });

    console.log(project);

    if (!project) {
      console.log(1111);

      return false;
    }

    if (user.role === UserRole.OWNER && project.ownerId === user.userId) {
      console.log(2222);
      return true;
    }

    if (user.role === UserRole.DEVELOPER) {
      console.log(3333);

      return project.developers.some((dev) => dev.id === user.userId);
    }

    return false;
  }
  async update(projectId: string, updateProjectDto: UpdateProjectDto, user) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (user.role !== UserRole.OWNER || project.ownerId !== user.userId) {
      throw new ForbiddenException(
        'You do not have permission to update this project',
      );
    }

    // Extraer developersIds del DTO y eliminar para no pasar dos veces
    const { developersIds, ...restData } = updateProjectDto;

    // Preparar el objeto data para update
    const dataToUpdate: any = {
      ...restData,
      ...(restData.deadline ? { deadline: new Date(restData.deadline) } : {}),
    };

    // Si vienen developersIds, reemplazar la lista con 'set'
    if (developersIds) {
      dataToUpdate.developers = {
        set: developersIds.map((id) => ({ id })),
      };
    }

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
