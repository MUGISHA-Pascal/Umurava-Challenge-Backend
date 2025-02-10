import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from '../models/auth.model';
import { RoleEnum } from '../enums/role.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<Users>) {}
  async getUser(id: string) {
    const user = await this.userModel.findById(id);
    if (user) {
      return user;
    } else {
      return new NotFoundException('user not found');
    }
  }
  async getUsers() {
    const users = await this.userModel.find();
    if (users) {
      return users;
    } else {
      return new NotFoundException('no users found');
    }
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (user) {
      return user;
    } else {
      return new NotFoundException('user not found');
    }
  }

  async findParticipants() {
   try {
    const talents = await this.userModel.find({ roles: "talent" });
    if(talents.length > 0){
      return talents;
    }else {
      return new NotFoundException('no talents found');
    }
   }catch (error) {
    console.log(error);
   
  }
}
  async findAdmins() {
   try {
    const talents = await this.userModel.find({ roles: "admin" });
    if(talents.length > 0){
      return talents;
    }else {
      return new NotFoundException('no talents found');
    }
   }catch (error) {
    console.log(error);
   
  }
}
}
