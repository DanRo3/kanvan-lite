import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import type { Risk, User, UserRole } from '@prisma/client';

@Injectable()
export class RiskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRiskDto: CreateRiskDto, user: User): Promise<Risk> {
    // Opcional: Validar permisos para crear riesgo si lo quieres (ej: solo Owner o developers linkeados)
    // Ejemplo: validar que el usuario tiene acceso al proyecto
    // const hasAccess = await this.checkUserAccess(createRiskDto.projectId, user);
    // if (!hasAccess) throw new ForbiddenException('No permissions for this project');

    return this.prisma.risk.create({
      data: createRiskDto,
    });
  }

  async update(
    id: string,
    updateRiskDto: UpdateRiskDto,
    user: User,
  ): Promise<Risk> {
    const risk = await this.prisma.risk.findUnique({ where: { id } });
    if (!risk) {
      throw new NotFoundException('Risk not found');
    }

    // Opcional: validar permisos del user en el proyecto del riesgo
    // const hasAccess = await this.checkUserAccess(risk.projectId, user);
    // if (!hasAccess) throw new ForbiddenException('No permissions for this project');

    return this.prisma.risk.update({
      where: { id },
      data: updateRiskDto,
    });
  }

  async delete(id: string, user: User): Promise<Risk> {
    const risk = await this.prisma.risk.findUnique({ where: { id } });
    if (!risk) {
      throw new NotFoundException('Risk not found');
    }

    // Opcional: validar permisos del user en el proyecto del riesgo
    // const hasAccess = await this.checkUserAccess(risk.projectId, user);
    // if (!hasAccess) throw new ForbiddenException('No permissions for this project');

    return this.prisma.risk.delete({ where: { id } });
  }

  async findById(id: string, user?: User): Promise<Risk> {
    const risk = await this.prisma.risk.findUnique({ where: { id } });
    if (!risk) {
      throw new NotFoundException('Risk not found');
    }

    // Opcional: validar acceso
    // if (user) {
    //   const hasAccess = await this.checkUserAccess(risk.projectId, user);
    //   if (!hasAccess) throw new ForbiddenException('No permissions for this project');
    // }

    return risk;
  }

  async findAll(projectId?: string, user?: User): Promise<Risk[]> {
    // Si envías projectId filtra solo esos riesgos
    // si quieres validar acceso, hazlo aquí con user y proyecto

    const where = projectId ? { projectId } : {};
    return this.prisma.risk.findMany({ where });
  }

  /* Opcional: método para validar acceso del usuario al proyecto */
  /*
  private async checkUserAccess(projectId: string, user: User): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { developers: true },
    });
    if (!project) return false;
    if (user.role === UserRole.OWNER && project.ownerId === user.id) return true;
    if (user.role === UserRole.DEVELOPER) {
      return project.developers.some(dev => dev.id === user.id);
    }
    return false;
  }
  */
}
