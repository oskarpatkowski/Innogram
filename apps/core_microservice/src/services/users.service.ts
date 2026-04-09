import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreateUserDto } from '../../dto/create.user.dto';
import { UpdateUserDto } from '../../dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: userDto,
    });
  }

  async getById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.user.findMany();
  }

  async update(id: string, userDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: userDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
