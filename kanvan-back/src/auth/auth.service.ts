import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { type User, UserRole } from '@prisma/client';
import axios from 'axios';

interface SocialUser {
  email: string;
  name?: string;
  picture?: string;
  provider: string;
  providerId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(socialUser: SocialUser) {
    // Busca usuario por email
    let user = await this.prisma.user.findUnique({
      where: { email: socialUser.email },
    });

    if (user) {
      // Actualiza info si hay cambios
      user = await this.prisma.user.update({
        where: { email: socialUser.email },
        data: {
          name: socialUser.name,
          image: socialUser.picture,
        },
      });
    } else {
      // Crea nuevo usuario
      user = await this.prisma.user.create({
        data: {
          email: socialUser.email,
          name: socialUser.name,
          image: socialUser.picture,
          role: 'DEVELOPER', // Valor por defecto
        },
      });
    }

    // Genera JWT con los claims solicitados
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return { accessToken: token, user };
  }

  // Intercambia el code por el token y perfil (ejemplo para Google)
  async loginWithGoogleCode(code: string, redirectUri: string) {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', process.env.GOOGLE_CLIENT_ID ?? '');
    params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET ?? '');
    params.append('redirect_uri', redirectUri);
    params.append('grant_type', 'authorization_code');

    // Paso 1: Intercambiar código por token
    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      params.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    const { access_token } = tokenRes.data;

    // Paso 2: Obtener perfil
    const profileRes = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    const profile = profileRes.data;

    return this.validateOAuthLogin({
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      provider: 'google',
      providerId: profile.id,
    });
  }

  async loginWithGithubCode(code: string) {
    // Paso 1: Intercambiar código por token
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } },
    );

    const { access_token } = tokenRes.data;

    // Paso 2: Obtener perfil del usuario
    const profileRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${access_token}` },
    });

    const emailsRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `token ${access_token}` },
    });

    const primaryEmail = emailsRes.data.find((email) => email.primary)?.email;

    if (!primaryEmail)
      throw new UnauthorizedException('No primary email found from Github');

    const profile = profileRes.data;

    return this.validateOAuthLogin({
      email: primaryEmail,
      name: profile.name || profile.login,
      picture: profile.avatar_url,
      provider: 'github',
      providerId: profile.id.toString(),
    });
  }
}
