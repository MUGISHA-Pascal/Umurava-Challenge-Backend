import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { RoleEnum } from '../enums/role.enum';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(RoleEnum, { each: true })
  @IsNotEmpty()
  roles: RoleEnum[];

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
