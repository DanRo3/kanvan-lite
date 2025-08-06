import { IsEnum } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  @ApiProperty()
  status: TaskStatus;
}
