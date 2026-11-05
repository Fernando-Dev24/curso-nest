import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';

@Injectable()
export class TokensService {
  constructor(private readonly jwtService: JwtService) {}

  async createAccessToken(userId: string, email: string, sid: string) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
      sid,
    });
  }

  generateRefreshToken() {
    return randomBytes(32).toString('base64');
  }

  hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
