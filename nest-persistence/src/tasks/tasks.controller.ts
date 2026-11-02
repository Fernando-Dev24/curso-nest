import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { Task } from './tasks.types.js';
import { type CreateTaskDto, createTaskDto } from './dto/create-task.dto.js';
import { type UpdateTaskDto, updateTaskDto } from './dto/update-task.dto.js';
import {
  type TaskPaginationDto,
  taskPaginationSchema,
} from './dto/task-pagination.dto.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  async findAll(
    @Query({ schema: taskPaginationSchema }) pagination: TaskPaginationDto,
  ): Promise<Task[]> {
    return await this.taskService.findAll(pagination);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.findById(id);
  }

  @Post()
  create(@Body({ schema: createTaskDto }) body: CreateTaskDto) {
    return this.taskService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body({ schema: updateTaskDto }) body: UpdateTaskDto,
  ) {
    return this.taskService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.delete(id);
  }
}
