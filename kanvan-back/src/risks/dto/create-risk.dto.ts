// create-risk.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RiskScope } from '@prisma/client';

export class CreateRiskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEnum(RiskScope)
  @IsNotEmpty()
  @ApiProperty({ enum: RiskScope })
  scope: RiskScope;
}
