import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { TasksController } from './task.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectsModule } from '../projects/project.module';

@Module({
  imports: [PrismaModule, ProjectsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
