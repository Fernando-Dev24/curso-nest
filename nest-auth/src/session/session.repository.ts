import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { addDays } from 'date-fns';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(userId: string, hashedToken: string) {
    const EXPIRATION_DATE = addDays(new Date(), 7);

    return this.prisma.session.create({
      data: {
        userId: userId,
        expiresAt: EXPIRATION_DATE,
        refreshTokenHash: hashedToken,
      },
    });
  }

  async findSessionByHash(hashedToken: string) {
    return this.prisma.session.findUnique({
      where: { refreshTokenHash: hashedToken },
    });
  }

  async findSessionById(id: string) {
    return this.prisma.session.findUnique({
      where: { id },
    });
  }

  async rotateRefreshToken(
    sessionId: string,
    newHash: string,
    oldHash: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const result = await tx.session.updateMany({
        where: {
          id: sessionId,
          refreshTokenHash: oldHash,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: {
          refreshTokenHash: newHash,
        },
      });

      if (result.count !== 1) {
        throw new UnauthorizedException();
      }

      await tx.consumedRefreshToken.create({
        data: {
          tokenHash: oldHash,
          sessionId: sessionId,
        },
      });
    });
  }

  async detectTokenReutilization(tokenHash: string) {
    return this.prisma.consumedRefreshToken.findUnique({
      where: { tokenHash },
    });
  }

  async revokedSession(sessionId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }
}
