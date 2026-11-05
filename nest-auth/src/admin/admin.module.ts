import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { AuthRepository } from '../auth/auth.repository.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  controllers: [AdminController],
  providers: [AdminService, AuthRepository, PrismaService],
})
export class AdminModule {}
