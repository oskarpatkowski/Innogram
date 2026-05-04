import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../dto/create.user.dto';
import { AccessGuard } from '../guards/access.guard';
import { UsersService } from '../services/users.service';

@Controller('users')
@UseGuards(AccessGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.getById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }
}
