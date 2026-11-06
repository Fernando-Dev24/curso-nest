import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(userId: string, hashedToken: string, expiresAt: Date) {
    return this.prisma.session.create({
      data: {
        userId: userId,
        expiresAt: expiresAt,
        refreshTokenHash: hashedToken,
      },
    });
  }

  async findSessionByHash(hashedToken: string) {
    return this.prisma.session.findUnique({
      where: {
        refreshTokenHash: hashedToken,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async findSessionById(id: string) {
    return this.prisma.session.findUnique({
      where: { id, revokedAt: null, expiresAt: { gt: new Date() } },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async rotateRefreshToken(
    sessionId: string,
    oldHash: string,
    newHash: string,
  ) {
    await this.prisma.$transaction(async (tx) => {
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

      // Marcar el viejo token como consumido
      await tx.consumedRefreshToken.create({
        data: {
          tokenHash: oldHash,
          sessionId: sessionId,
        },
      });
    });

    // Obtener la session actualiza
    return this.findSessionById(sessionId);
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
