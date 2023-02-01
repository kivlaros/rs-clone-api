import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { MessageDocument } from './message.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: UserDocument[];

  @Prop()
  lastMessage: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  messages: MessageDocument[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
