import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Users } from 'src/auth/models/auth.model';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true, default: false })
  isRead: boolean;

  @Prop({ required: true })
  message: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  user: Users;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
