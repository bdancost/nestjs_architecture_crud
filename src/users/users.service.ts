/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async create(dto: CreateUserDto): Promise<User> {
    if (dto.email === undefined) {
      throw new Error('email is required');
    }

    const data: Prisma.UserCreateInput = {
      name: dto.name,
      email: dto.email,
    };

    return this.prisma.user.create({
      data,
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const data: Prisma.UserUpdateInput = {
      ...dto,
    };

    return this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
