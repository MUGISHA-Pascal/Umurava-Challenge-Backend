import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthEntity } from '../entities/auth.entity';
import { LoginBodyDto, LoginResponseDto } from '../dto/response.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/role.guard';
import { RoleEnum } from '../enums/role.enum';
import { Roles } from '../guards/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: LoginResponseDto })
  @ApiBody({ type: LoginBodyDto })
  @Post('login')
  async login(@Body() loginBodyDto: LoginBodyDto, @Request() req) {
    return await this.authService.login(loginBodyDto);
  }

  @ApiBody({ type: AuthEntity })
  @ApiCreatedResponse({ type: AuthEntity })
  @Post('signup')
  signup(@Body() createUserDto: CreateAuthDto) {
    console.log(createUserDto);
    return this.authService.signup(createUserDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.TALENT)
  @Get('admin')
  getAdminRoute(@Request() req) {
    return {
      message: 'This route is for ADMIN only!',
      user: req.user, // The authenticated user
    };
  }
}
