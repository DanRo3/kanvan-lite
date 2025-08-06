import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsDateString()
  @ApiProperty()
  deadline: string;

  @IsInt()
  @Min(1)
  @ApiProperty()
  pointsBudget: number;

  @IsEnum(ProjectStatus)
  @ApiProperty()
  status: ProjectStatus;
}
