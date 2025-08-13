import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/project.module';
import { TasksModule } from './tasks/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { RiskModule } from './risks/risk.module';
import { UserModule as SeederModule } from './modules/user/user.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
    RiskModule,
    UserModule,
    SeederModule,
  ],
})
export class AppModule {}
