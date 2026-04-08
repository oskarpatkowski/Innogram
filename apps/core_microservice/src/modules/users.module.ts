import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { UsersService } from '../services/users.service';

@Module({
  imports: [PrismaService],
  controllers: [],
  providers: [UsersService],
})
export class UsersModule {}
