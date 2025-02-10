import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthEntity } from '../entities/auth.entity';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/role.guard';
import { RoleEnum } from '../enums/role.enum';
import { Roles } from '../guards/roles.decorator';

// users controllers

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  
  @ApiOkResponse({ type: AuthEntity })
  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUser(id);
    return user;
  }
  

  // get participants 
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @ApiOkResponse({ type: AuthEntity, isArray: true })
  @Get('talents/all')
  async getParticipants() {
    return this.userService.findParticipants();
  }


   // get admins 
   @UseGuards(AuthGuard, RolesGuard)
   @Roles(RoleEnum.ADMIN)
   @ApiOkResponse({ type: AuthEntity, isArray: true })
   @Get('/admins/all')
   async getAdmins() {
     return this.userService.findAdmins();
   }
}
