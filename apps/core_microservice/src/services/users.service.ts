import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreateUserDto } from '../../dto/create.user.dto';
import { UpdateUserDto } from '../../dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userDto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: userDto,
    });
    Logger.log(`User ${user.id} created`, 'UsersService');
    return user;
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (user) {
      Logger.log(`User ${user.id} found`, 'UsersService');
    } else {
      Logger.log(`User ${id} not found`, 'UsersService');
    }

    return user;
  }

  async getAll() {
    const users = await this.prisma.user.findMany();

    if (users.length > 0) {
      Logger.log(`Found ${users.length} users`, 'UsersService');
    } else {
      Logger.log(`No users found`, 'UsersService');
    }

    return users;
  }

  async update(id: string, userDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: userDto,
    });

    Logger.log(`User ${user.id} updated`, 'UsersService');

    return user;
  }

  async delete(id: string) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    if (user) {
      Logger.log(`User ${user.id} deleted`, 'UsersService');
    } else {
      Logger.log(`User ${id} not found`, 'UsersService');
    }

    return user;
  }
}
