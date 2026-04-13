/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  async getPublishedPosts(): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: true,
      },
    });
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const { authorEmail, ...postData } = dto;

    const data: Prisma.PostCreateInput = {
      ...postData,
      author: {
        connect: {
          email: authorEmail,
        },
      },
    };

    return this.prisma.post.create({
      data,
    });
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const data: Prisma.PostUpdateInput = {
      ...dto,
    };

    return this.prisma.post.update({
      data,
      where: { id },
    });
  }

  async remove(id: number): Promise<Post> {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
