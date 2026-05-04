import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountController } from '../controllers/account.controller';
import { ProfileConfigController } from '../controllers/profile.config.contoller';
import { ProfileController } from '../controllers/profile.controller';
import { UsersController } from '../controllers/users.controller';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { PrismaService } from '../services/prisma.service';
import { ProfileConfigService } from '../services/profile.config.service';
import { ProfileService } from '../services/profile.service';
import { UsersService } from '../services/users.service';

@Module({
  imports: [],
  controllers: [
    UsersController,
    AccountController,
    ProfileController,
    ProfileConfigController,
  ],
  providers: [
    UsersService,
    PrismaService,
    ConfigService,
    AccountService,
    ProfileService,
    ProfileConfigService,
    AuthService,
  ],
})
export class UsersModule {}
