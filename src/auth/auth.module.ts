import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './models/auth.model';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { JwtStrategy } from './guards/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
dotenv.config();
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY as string,
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule,
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, JwtStrategy, AuthGuard, RolesGuard],
  exports: [AuthService, JwtModule, AuthGuard, RolesGuard],
})
export class AuthModule {}
