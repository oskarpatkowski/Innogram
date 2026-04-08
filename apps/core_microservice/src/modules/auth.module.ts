import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { AuthService } from '../services/auth.service';

@Module({
  imports: [PrismaService],
  controllers: [],
  providers: [AuthService],
})
export class AuthModule {}
