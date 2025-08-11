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
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  name?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  description?: string;

  @ApiProperty()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  deadline?: Date;

  @IsInt()
  @Min(1)
  @ApiProperty()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  pointsBudget?: number;

  @IsEnum(ProjectStatus)
  @ApiProperty()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  status?: ProjectStatus;

  @IsInt()
  @ApiProperty()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  pointsUsed?: number;

  @IsInt()
  @ApiProperty()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  criticalBugs?: number;

  @IsInt()
  @ApiProperty()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  normalBugs?: number;

  @IsInt()
  @ApiProperty()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  lowBugs?: number;

  @IsInt()
  @ApiProperty()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  testCoberage?: number;
}
