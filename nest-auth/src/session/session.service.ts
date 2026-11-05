import { Injectable } from '@nestjs/common';
import { SessionRepository } from './session.repository.js';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async createSession(userId: string, hashedToken: string) {
    return this.sessionRepository.createSession(userId, hashedToken);
  }
}
