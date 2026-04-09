import { PartialType } from '@nestjs/mapped-types'; // or '@nestjs/swagger'
import { CreateUserDto } from './create.user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
