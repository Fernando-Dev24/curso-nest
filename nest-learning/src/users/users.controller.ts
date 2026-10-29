import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  type CreateUserDto,
  createUserSchema,
} from '../dtos/create-user.dto.js';

interface IUser {
  id: number;
  name: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll(): IUser[] {
    return this.userService.findAll();
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
