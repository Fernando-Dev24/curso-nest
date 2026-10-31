import { Injectable } from '@nestjs/common';
import { Task } from './tasks.types.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async findById(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  create(data: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: data.title,
      },
    });
  }

  update(id: number, data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.isCompleted !== undefined && {
          isCompleted: data.isCompleted,
        }),
      },
    });
  }

  delete(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
