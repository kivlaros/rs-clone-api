import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UPostDocument } from 'src/posts/schemas/upost.schema';
import { UImageDocument } from './uimage.schema';
import { ChatDocument } from 'src/chats/schemas/chat.schema';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty()
  @Prop({ unique: true })
  username: string;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UImage' })
  avatar: UImageDocument;

  @ApiProperty()
  @Prop()
  isOnline: boolean;

  @ApiProperty()
  @Prop()
  background: string;

  @ApiProperty()
  @Prop()
  audio: string[];

  @ApiProperty()
  @Prop()
  lastVisit: Date;
  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  subscriptions: UserDocument[];

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  subscribers: UserDocument[];

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UImage' }] })
  gallery: UImageDocument[];

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UPost' }] })
  posts: UPostDocument[];

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }] })
  chats: ChatDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
