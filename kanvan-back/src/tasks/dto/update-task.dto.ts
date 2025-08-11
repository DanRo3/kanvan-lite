import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsInt()
  @Min(1)
  @ApiProperty()
  points: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @ApiProperty()
  developmentHours?: number;

  @IsEnum(TaskStatus)
  @ApiProperty()
  status: TaskStatus;
}
