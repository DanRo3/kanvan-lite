import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class LoginInput {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ nullable: true })
  redirectUri?: string | null;
}

export class LoginGithub {
  @ApiProperty()
  @IsNotEmpty()
  code: string;
}
