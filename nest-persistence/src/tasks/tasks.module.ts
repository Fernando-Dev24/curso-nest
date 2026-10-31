import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { TasksController } from './tasks.controller.js';
import { TaskRepository } from './tasks.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [TasksService, TaskRepository],
  controllers: [TasksController],
})
export class TasksModule {}
