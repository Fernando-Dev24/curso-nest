import { Injectable } from '@nestjs/common';
import { Task } from './tasks.types.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import type { TaskPaginationDto } from './dto/task-pagination.dto.js';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: TaskPaginationDto): Promise<Task[]> {
    const skip = (pagination.page - 1) * pagination.limit;

    return this.prisma.task.findMany({
      skip,
      take: pagination.limit,
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        title: true,
        isCompleted: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        isCompleted: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  create(data: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        userId: data.userId,
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
