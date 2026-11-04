import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthRepository } from './auth.repository.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokensService } from '../tokens/tokens.service.js';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error('Error: JWT_SECRET key is not defined');
        }

        return {
          secret,
          signOptions: { expiresIn: '15m', algorithm: 'HS256' },
        };
      },
    }),
  ],
  providers: [AuthService, AuthRepository, TokensService],
  controllers: [AuthController],
})
export class AuthModule {}
