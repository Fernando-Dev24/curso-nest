import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  type CreateUserDto,
  createUserSchema,
} from '../dtos/create-user.dto.js';
import { ApiKeyGuard } from './guards/api-key.guard.js';
import { LoggingInterceptor } from './interceptors/logging.interceptor.js';

interface IUser {
  id: number;
  name: string;
}

@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll(): IUser[] {
    return this.userService.findAll();
  }

  @Get('profile')
  @UseGuards(ApiKeyGuard)
  getProfile() {
    return {
      message: 'Acceso autorizado',
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): IUser {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body({ schema: createUserSchema }) body: CreateUserDto) {
    const newUser = this.userService.create(body);
    return {
      message: 'Usuario creado con exito',
      newUser,
    };
  }
}
