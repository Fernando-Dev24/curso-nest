import { Injectable } from '@nestjs/common';
import { Task } from './tasks.types.js';

@Injectable()
export class TaskRepository {
  private tasks: Task[] = [
    { id: 1, title: 'Completar el ejercicio', isCompleted: false },
    { id: 2, title: 'Tener mi hora de almuerzo', isCompleted: false },
    { id: 3, title: 'Completar los avalúos pendientes', isCompleted: true },
  ];

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }

  async findById(id: number): Promise<Task | null> {
    return this.tasks.find((t) => t.id === id) ?? null;
  }
}
