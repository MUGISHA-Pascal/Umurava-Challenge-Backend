import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from 'src/auth/models/auth.model';

import { ParticipantsService } from './services/participants.service';
import { ParticipantsController } from './controllers/participants.controller';
import { Participant, ParticipantSchema } from './models/participants.model';
import {
  Challenge,
  ChallengeSchema,
} from 'src/challenge/models/challenge.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
      { name: Users.name, schema: UserSchema },
      { name: Challenge.name, schema: ChallengeSchema },
    ]),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantModule {}
