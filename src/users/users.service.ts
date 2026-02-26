/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
  ];

  create(createUserDto: CreateUserDto) {
    const id = this.users[this.users.length - 1].id + 1;

    const { id: _dtoId, ...dto } = createUserDto;

    const user: User = {
      id,
      ...dto,
    };

    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const newUser: User = {
      ...user,
      ...updateUserDto,
    };

    const index = this.users.indexOf(user);

    this.users[index] = newUser;

    return newUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
