import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        role: UserRole.DEVELOPER,
      },
      include: {
        projects: true,
        developingProjects: true,
        tasks: true,
      },
    });
  }

  async findAllDevelopers(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role: UserRole.DEVELOPER },
      include: {
        projects: true,
        developingProjects: true,
        tasks: true,
      },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        projects: true,
        developingProjects: true,
        tasks: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
      include: {
        projects: true,
        developingProjects: true,
        tasks: true,
      },
    });
  }

  async delete(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.delete({
      where: { id },
      include: {
        projects: true,
        developingProjects: true,
        tasks: true,
      },
    });
  }

  /**
   * Obtener todos los usuarios (developers) que trabajan en un proyecto dado el projectId.
   * Esto incluye a los usuarios asociados como desarrolladores en developingProjects y que tengan rol developer.
   */
  async findAllByProjectId(projectId: string): Promise<User[]> {
    // Obtener el proyecto con sus desarrolladores
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        developers: {
          where: { role: UserRole.DEVELOPER },
          include: {
            projects: true,
            developingProjects: true,
            tasks: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project.developers;
  }
}
