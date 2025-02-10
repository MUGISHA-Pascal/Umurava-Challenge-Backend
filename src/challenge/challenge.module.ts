/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ChallengeService } from './services/challenge.service';
import { ChallengeController } from './controllers/challenge.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenge, ChallengeSchema } from './models/challenge.model';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';
import { Users, UserSchema } from 'src/auth/models/auth.model';
import {
  Participant,
  ParticipantSchema,
} from '../participants/models/participants.model';
import { Cache } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Users.name, schema: UserSchema },
      { name: Participant.name, schema: ParticipantSchema },
    ]),
    AuthModule,
    NotificationModule,
  ],
  providers: [ChallengeService],
  controllers: [ChallengeController],
})
export class ChallengeModule {}
