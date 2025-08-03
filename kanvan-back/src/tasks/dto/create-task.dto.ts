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
  title: string;

  @IsInt()
  @Min(1)
  points: number;

  @IsUUID()
  projectId: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  developmentHours?: number;
}
