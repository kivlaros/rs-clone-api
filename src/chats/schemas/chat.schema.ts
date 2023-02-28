import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { NewMessageDocument } from './new-message.schema';
import { ApiProperty } from '@nestjs/swagger';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: UserDocument[];

  @ApiProperty()
  @Prop()
  lastMessage: Date;

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewMessage' }] })
  messages: NewMessageDocument[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
