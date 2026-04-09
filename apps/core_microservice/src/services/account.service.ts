import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { UpdateAccountDto } from '../../dto/update.account.dto';
import { CreateAccountDto } from '../../dto/create.account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAccountDto) {
    return await this.prisma.account.create({
      data: {
        userId: dto.userId,
        email: dto.email,
        provider: dto.provider,
        providerId: dto.providerId,
        passwordHash: dto.passwordHash,
        lastLoginAt: new Date(),
        createdById: dto.createdById,
      },
    });
  }

  async getById(id: string) {
    return await this.prisma.account.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.account.findMany();
  }

  async update(id: string, accountDto: UpdateAccountDto) {
    return await this.prisma.account.update({
      where: {
        id,
      },
      data: accountDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.account.delete({
      where: {
        id,
      },
    });
  }
}
