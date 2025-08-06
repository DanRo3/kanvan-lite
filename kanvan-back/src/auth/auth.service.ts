import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { type User, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthUser(profile: any, provider: string): Promise<User> {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || profile.username;
    const image = profile.photos?.[0]?.value;

    if (!email) {
      throw new Error('Email not provided by OAuth provider');
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          image,
          role: UserRole.DEVELOPER, // Default role
        },
      });
    } else {
      // Update user info if needed
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          image: image || user.image,
        },
      });
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
    };
  }

  async loginWithOAuth(profile: any, provider: string) {
    // Obtiene o crea el usuario usando el perfil OAuth
    const user = await this.validateOAuthUser(profile, provider);

    // Prepara el payload asegurando incluir nombre como claim
    const payload = {
      sub: user.id,
      name: user.name, // incluye nombre
      role: user.role,
    };

    // Genera y retorna el JWT junto con los datos del usuario
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
