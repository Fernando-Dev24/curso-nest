import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service.js';
import { TaskRepository } from './tasks.repository.js';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  const repository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    transferTasks: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    service = new TasksService(repository as unknown as TaskRepository);
  });

  it('debe devolver una tarea existente', async () => {
    const task = {
      id: 1,
      title: 'Tarea de prueba',
      isCompleted: false,
      user: {
        id: 1,
        name: 'Ana',
      },
    };

    repository.findById.mockResolvedValue(task);

    const result = await service.findById(1);

    expect(result).toEqual(task);
    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(repository.findById).toHaveBeenCalledTimes(1);
  });

  it('debe lanzar 404 si la tarea no existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(99)).rejects.toThrow(NotFoundException);
  });

  it('debe de crear una tarea nueva', async () => {
    repository.create.mockResolvedValue({
      id: 1,
      title: 'Tarea de prueba',
      isCompleted: false,
    });

    await expect(
      service.create({
        title: 'Tarea de prueba',
        userId: 1,
      }),
    ).resolves.toEqual({
      id: 1,
      title: 'Tarea de prueba',
      isCompleted: false,
    });
    expect(repository.create).toHaveBeenCalledWith({
      title: 'Tarea de prueba',
      userId: 1,
    });
  });

  it('debe de eliminar una tarea existente', async () => {
    repository.delete.mockResolvedValue({
      id: 1,
      title: 'Tarea de prueba',
      isCompleted: false,
    });

    await expect(service.delete(1)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
