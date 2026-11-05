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
import { SessionService } from '../session/session.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokensService,
    private readonly sessionService: SessionService,
  ) {}

  async getProfile(id: string) {
    const user = await this.authRepository.getProfile(id);

    if (!user) throw new NotFoundException('Tu usuario no se encontró');

    return user;
  }

  async login(credentials: LoginDto) {
    const user = await this.authRepository.login(credentials);

    // * VERIFICAR CREDENCIALES
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

    // * GENERAR REFRESH TOKEN
    const refreshToken = this.tokenService.generateRefreshToken();
    const hashedToken = this.tokenService.hashRefreshToken(refreshToken);

    // * CREAR SESSION
    const session = await this.sessionService.createSession(
      user.id,
      hashedToken,
    );

    // * GENERAR EL ACCESS TOKEN

    const accessToken = await this.tokenService.createAccessToken(
      user.id,
      user.email,
      session.id,
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
