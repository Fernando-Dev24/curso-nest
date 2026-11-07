import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from '../auth/auth.repository.js';
import { SessionRepository } from '../session/session.repository.js';

type JwtPayload = {
  sub: string;
  email: string;
  sid: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly sessionRepository: SessionRepository,
  ) {
    const secret = configService.getOrThrow<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.sid) {
      throw new UnauthorizedException();
    }

    const [user, session] = await Promise.all([
      this.authRepository.findById(payload.sub),
      this.sessionRepository.findSessionById(payload.sid),
    ]);

    if (!user || !session || session.userId !== user.id) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
