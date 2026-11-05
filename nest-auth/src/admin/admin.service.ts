import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../auth/auth.repository.js';

@Injectable()
export class AdminService {
  constructor(private readonly authRepository: AuthRepository) {}

  getAllUsers() {
    return this.authRepository.getAllUsers();
  }
}
