import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Roles } from 'src/auth/decorators/roles.decorator'; // si tienes ese enum definido, o reemplaza por tu enum Prisma
import { UserRole } from '@prisma/client';

@Injectable()
export class OwnerSeederService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createOwnerUser(): Promise<void> {
    const ownerName = this.configService.get<string>('SEED_OWNER_USER')!;
    const ownerEmail = this.configService.get<string>('SEED_OWNER_EMAIL')!;

    // Busca usuario por username (suponiendo que username es único)
    const existingUser = await this.prisma.user.findUnique({
      where: { email: ownerEmail },
    });

    if (!existingUser) {
      await this.prisma.user.create({
        data: {
          name: ownerName,
          email: ownerEmail,
          role: UserRole.OWNER,
        },
      });

      console.log('Owner User Created:', ownerEmail);
    } else {
      console.log('Owner User already exists:', ownerEmail);
    }
  }
}
