import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import { ProjectStatus } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
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

  @IsInt()
  @ApiProperty()
  pointsUsed: number;

  @IsInt()
  @ApiProperty()
  criticalBugs: number;

  @IsInt()
  @ApiProperty()
  normalBugs: number;

  @IsInt()
  @ApiProperty()
  lowBugs: number;

  @IsInt()
  @ApiProperty()
  testCoberage: number;
}
