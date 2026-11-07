import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionRepository } from './session.repository.js';
import { addDays } from 'date-fns';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async createSession(userId: string, hashedToken: string) {
    const expiresAt = addDays(new Date(), 7);

    return this.sessionRepository.createSession(userId, hashedToken, expiresAt);
  }

  async refreshSession(oldToken: string, newToken: string) {
    // 1. Validar que la session no este expirada o revocada
    const session = await this.sessionRepository.findSessionByHash(oldToken);

    // 2. Si no existe, investigar si el token fue consumido
    if (!session) {
      return await this.handleInvalidRefreshToken(oldToken);
    }

    // 3. Rotar token
    const updatedSession = await this.sessionRepository.rotateRefreshToken(
      session.id,
      oldToken,
      newToken,
    );

    // 4. La rotación pudo fallar por una petición concurrente
    if (!updatedSession) {
      return await this.handleInvalidRefreshToken(oldToken);
    }

    return updatedSession;
  }

  async logout(tokenHashed: string) {
    // Obtener la sesion por token
    const session = await this.sessionRepository.findSessionByHash(tokenHashed);

    if (!session) return;

    return this.sessionRepository.revokedSession(session?.id);
  }

  private async handleInvalidRefreshToken(tokenHash: string): Promise<never> {
    const consumedToken =
      await this.sessionRepository.detectTokenReutilization(tokenHash);

    if (consumedToken) {
      await this.sessionRepository.revokedSession(consumedToken.sessionId);
    }

    throw new UnauthorizedException('Refresh token invalido o expirado');
  }
}
