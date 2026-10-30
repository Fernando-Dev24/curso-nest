import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './tasks.repository.js';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll() {
    return await this.taskRepository.findAll();
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
}
