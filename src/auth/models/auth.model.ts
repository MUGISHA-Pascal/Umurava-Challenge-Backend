import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleEnum } from '../enums/role.enum';

@Schema({ timestamps: true })
export class Users {
  constructor(
    username: string,
    email: string,
    password: string,
    roles: RoleEnum[],
  ) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.roles = roles;
  }
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ type: String, enum: Object.values(RoleEnum) , required: true })
  roles: RoleEnum[];
}


export const UserSchema = SchemaFactory.createForClass(Users);
