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
import { CreateAccountDto } from '../../dto/create.account.dto';
import { UpdateAccountDto } from '../../dto/update.account.dto';
import { AccountService } from '../services/account.service';
import { AccessGuard } from '../guards/access.guard';

@Controller('accounts')
@UseGuards(AccessGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountService.create(createAccountDto);
  }

  @Get()
  async findAll() {
    return await this.accountService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.accountService.getById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return await this.accountService.update(id, updateAccountDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.accountService.delete(id);
  }
}
