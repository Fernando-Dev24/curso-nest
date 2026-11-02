import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TasksModule } from './tasks/tasks.module.js';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TasksModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
