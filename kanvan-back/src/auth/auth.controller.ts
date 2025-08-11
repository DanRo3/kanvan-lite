import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import LoginInput, { LoginGithub } from './login.input';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  async loginGoogle(@Body() body: LoginInput) {
    return this.authService.loginWithGoogleCode(body.code, body.redirectUri!);
  }

  @Post('github')
  async loginGithub(@Body() body: LoginGithub) {
    return this.authService.loginWithGithubCode(body.code);
  }
}
