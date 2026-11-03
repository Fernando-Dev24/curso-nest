import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { MockAuthGuard } from './guards/mock-auth.guard.js';
import { type LoginDto, loginSchema } from './dto/login.dto.js';
import { type EmailQueryDto, emailQuerySchema } from './dto/email-query.dto.js';
import { type RegisterDto, registerSchema } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(MockAuthGuard)
  @Get('profile')
  getProfile(@Body({ schema: emailQuerySchema }) body: EmailQueryDto) {
    return this.authService.getProfile(body.email);
  }

  @Post('login')
  login(@Body({ schema: loginSchema }) credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @Post('register')
  register(@Body({ schema: registerSchema }) body: RegisterDto) {
    return this.authService.register(body);
  }
}
