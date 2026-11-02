import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './tasks.repository.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import type { TaskPaginationDto } from './dto/task-pagination.dto.js';
import { TransferTasksDto } from './dto/transfer-tasks.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll(pagination: TaskPaginationDto) {
    return await this.taskRepository.findAll(pagination);
  }

  async findById(id: number) {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(
        `La task con el id ${id} solicitado no existe.`,
      );
    }

    return task;
  }

  create(dto: CreateTaskDto) {
    return this.taskRepository.create(dto);
  }

  async update(id: number, dto: UpdateTaskDto) {
    return await this.taskRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }

  transferTasks(dto: TransferTasksDto) {
    return this.taskRepository.transferTasks(dto);
  }
}
