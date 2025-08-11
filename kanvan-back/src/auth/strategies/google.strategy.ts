import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    if (!profile.emails || !profile.emails.length) {
      throw new UnauthorizedException('No email found from Google provider');
    }
    const user = {
      email: profile.emails[0].value,
      name: profile.displayName,
      picture: profile.photos?.[0]?.value,
      provider: 'google',
      providerId: profile.id,
    };
    return user;
  }
}
