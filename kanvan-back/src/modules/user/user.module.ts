import { PrismaService } from 'src/prisma/prisma.service';
import { OwnerSeederService } from './owner-seeder.service';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  providers: [OwnerSeederService, PrismaService, ConfigService], // asegúrate de incluir prisma y config si los usas aquí
  exports: [OwnerSeederService], // si quieres usarlo en otros módulos
})
export class UserModule {}
