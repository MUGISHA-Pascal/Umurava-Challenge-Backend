import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Users } from '../models/auth.model';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { LoginBodyDto } from '../dto/response.dto';
interface validatedUserTypes {
  email: string;
  username: string;
  roles: string[];
}
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private userService: Model<Users>,
  ) {}
  async login(user: LoginBodyDto) {
    const validatedUser = await this.validateUser(user.email, user.password);

    if (
      validatedUser?.email &&
      validatedUser?.username &&
      validatedUser?.roles
    ) {
      const payload = {
        id: validatedUser.id,
        email: validatedUser.email,
        username: validatedUser.username,
        roles: validatedUser.roles,
      };

      return {
        accessToken: this.jwtService.sign(payload),
        status: 200,
        user: payload, // Sign the payload
      };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async signup(createUserDto: CreateAuthDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userService.create(createUserDto);
    return user;
  }
  async validateUser(email: string, plainPassword: string) {
    const user = await this.userService.findOne({ email });
    if (user) {
      const { password, username, email, roles } = user;
      const ismatch = await bcrypt.compare(plainPassword, user.password);
      if (ismatch) {

        return { id: user._id, email, username, roles, status: 200 };
      } else {
        console.log('passwords not match');
        throw new Error('passwords not match');
      }
    } else {
      return null;
    }
  }
}
