import { Injectable, NotFoundException } from '@nestjs/common';

const USERS = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Carlos' },
  { id: 3, name: 'María' },
];

@Injectable()
export class UsersService {
  findAll() {
    return USERS;
  }

  findOne(id: number) {
    const user = USERS.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`El usuario con ID ${id} no existe`);
    }

    return user;
  }
}
