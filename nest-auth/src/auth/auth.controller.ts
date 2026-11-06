import { Controller, Post, Body, UseGuards, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { type LoginDto, loginSchema } from './dto/login.dto.js';
import { type RegisterDto, registerSchema } from './dto/register.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { AuthenticatedUser } from './types/types.js';
import { HttpAdapterHost } from '@nestjs/core';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.id);
  }

  @Post('login')
  async login(
    @Body({ schema: loginSchema }) credentials: LoginDto,
    @Res({ passthrough: true }) res: unknown,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(credentials);

    this.adapterHost.httpAdapter.setCookie(res, 'refresh-token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken, user };
  }

  @Post('register')
  register(@Body({ schema: registerSchema }) body: RegisterDto) {
    return this.authService.register(body);
  }
}
