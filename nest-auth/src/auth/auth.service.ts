import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { handleHashPassword } from '../utils/salt-password.js';
import { AuthRepository } from './auth.repository.js';
import { handleVerifyPassword } from '../utils/verify-password.js';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  getProfile(email: string) {
    return this.authRepository.getProfile(email);
  }

  async login(credentials: LoginDto) {
    const user = await this.authRepository.login(credentials);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValid = await handleVerifyPassword(
      user.passwordHash,
      credentials.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { passwordHash, ...rest } = user;

    return {
      accessToken: 'mock-access-token',
      user: { ...rest },
    };
  }

  async register(credentials: RegisterDto) {
    const password = await handleHashPassword(credentials.password);
    return this.authRepository.register({
      email: credentials.email,
      name: credentials.name,
      password,
    });
  }
}
