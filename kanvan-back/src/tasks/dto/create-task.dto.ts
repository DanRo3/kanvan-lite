import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsInt()
  @Min(1)
  @ApiProperty()
  points: number;

  @ApiProperty()
  projectId: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @ApiProperty()
  developmentHours?: number;
}
