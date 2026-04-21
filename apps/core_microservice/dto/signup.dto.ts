import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsDate()
  @IsNotEmpty()
  birthdate!: Date;

  @IsString()
  @IsNotEmpty()
  useragent!: string;

  @IsString()
  @IsNotEmpty()
  ipaddress!: string;
}
