import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { handleHashPassword } from '../utils/salt-password.js';
import { AuthRepository } from './auth.repository.js';
import { handleVerifyPassword } from '../utils/verify-password.js';
import { TokensService } from '../tokens/tokens.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokensService,
  ) {}

  async getProfile(id: string) {
    const user = await this.authRepository.getProfile(id);

    if (!user) throw new NotFoundException('Tu usuario no se encontró');

    return user;
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

    const accessToken = await this.tokenService.createAccessToken(
      user.id,
      user.email,
    );
    const { passwordHash, ...rest } = user;

    return {
      accessToken,
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
