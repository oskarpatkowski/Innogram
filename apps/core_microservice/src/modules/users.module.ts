import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AccountService } from '../services/account.service';
import { UsersController } from '../controllers/users.controller';
import { AccountController } from '../controllers/account.controller';
import { ProfileController } from '../controllers/profile.controller';
import { ProfileService } from '../services/profile.service';

@Module({
  imports: [],
  controllers: [UsersController, AccountController, ProfileController],
  providers: [
    UsersService,
    PrismaService,
    ConfigService,
    AccountService,
    ProfileService,
  ],
})
export class UsersModule {}
