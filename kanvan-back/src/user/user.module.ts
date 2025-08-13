import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectsModule } from 'src/projects/project.module';
import { TasksModule } from 'src/tasks/task.module';

@Module({
  imports: [PrismaModule, ProjectsModule, TasksModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
