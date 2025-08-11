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

  @ApiProperty()
  deadline: Date;

  @IsInt()
  @Min(1)
  @ApiProperty()
  pointsBudget: number;
}
