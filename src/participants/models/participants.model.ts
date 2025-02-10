import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Users } from 'src/auth/models/auth.model';
import { Challenge } from '../../challenge/models/challenge.model';

export type ParticipantDocument = Participant & Document;

@Schema({ timestamps: true })
export class Participant {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Users.name,
    required: true,
  })
  user: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Challenge.name,
    required: true,
  })
  challenge: MongooseSchema.Types.ObjectId;
  @Prop({ required: false, default: true })
  status: boolean;

  
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
