import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { UpdateAccountDto } from '../../dto/update.account.dto';
import { CreateAccountDto } from '../../dto/create.account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAccountDto) {
    const account = await this.prisma.account.create({
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
    Logger.log(`Account ${account.id} created`, 'AccountService');
    return account;
  }

  async getById(id: string) {
    const account = await this.prisma.account.findUnique({
      where: {
        id,
      },
    });

    if (account) {
      Logger.log(`Account ${account.id} found`, 'AccountService');
    } else {
      Logger.log(`Account ${id} not found`, 'AccountService');
    }

    return account;
  }

  async getAll() {
    const accounts = await this.prisma.account.findMany();

    if (accounts.length > 0) {
      Logger.log(`Found ${accounts.length} accounts`, 'AccountService');
    } else {
      Logger.log(`No accounts found`, 'AccountService');
    }

    return accounts;
  }

  async update(id: string, accountDto: UpdateAccountDto) {
    const account = await this.prisma.account.update({
      where: {
        id,
      },
      data: accountDto,
    });

    Logger.log(`Account ${account.id} updated`, 'AccountService');

    return account;
  }

  async delete(id: string) {
    const account = await this.prisma.account.delete({
      where: {
        id,
      },
    });

    if (account) {
      Logger.log(`Account ${account.id} deleted`, 'AccountService');
    } else {
      Logger.log(`Account ${id} not found`, 'AccountService');
    }

    return account;
  }
}
