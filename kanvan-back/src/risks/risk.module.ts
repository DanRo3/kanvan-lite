import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';

@Module({
  controllers: [RiskController],
  providers: [RiskService, PrismaService],
})
export class RiskModule {}
