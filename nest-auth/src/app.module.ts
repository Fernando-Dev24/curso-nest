import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './prisma/prisma-filter.exception.js';
import { JwtService } from '@nestjs/jwt';
import { AdminModule } from './admin/admin.module.js';
import { SessionService } from './session/session.service.js';
import { SessionModule } from './session/session.module.js';
import { SessionRepository } from './session/session.repository.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    AdminModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    JwtService,
    SessionService,
    SessionRepository,
  ],
})
export class AppModule {}
