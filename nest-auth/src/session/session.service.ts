import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionRepository } from './session.repository.js';
import { addDays } from 'date-fns';
import { NotFoundError } from 'rxjs';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async createSession(userId: string, hashedToken: string) {
    const expiresAt = addDays(new Date(), 7);

    return this.sessionRepository.createSession(userId, hashedToken, expiresAt);
  }

  async refreshSession(oldToken: string, newToken: string) {
    // 1. Validar que la session no este expirada o revocada
    const [session, consumedToken] = await Promise.all([
      await this.sessionRepository.findSessionByHash(oldToken),
      await this.sessionRepository.detectTokenReutilization(oldToken),
    ]);

    // 2. Sesion no encontrada pero token consumido = reutilizacion de token
    if (!session) {
      if (consumedToken) {
        await this.sessionRepository.revokedSession(consumedToken.sessionId);
      }

      throw new UnauthorizedException('Tu sesión ha expirado.');
    }

    // 3. Sesion no encontrada y token no consumido = No existe el token en ninguna tabla
    if (!session || !consumedToken) {
      throw new UnauthorizedException('Tu sesión ha expirado.');
    }

    // 4. Rotar token
    const updatedSession = await this.sessionRepository.rotateRefreshToken(
      session.id,
      oldToken,
      newToken,
    );

    if (!updatedSession) {
      throw new NotFoundException('No se encontró tu sesión');
    }

    return updatedSession;
  }
}
