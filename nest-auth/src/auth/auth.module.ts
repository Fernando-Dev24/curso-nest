import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthRepository } from './auth.repository.js';

@Module({
  imports: [PrismaModule],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModule {}
