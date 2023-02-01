import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UPostDocument } from 'src/posts/schemas/upost.schema';
import { UImageDocument } from './uimage.schema';
import { ChatDocument } from 'src/chats/schemas/chat.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UImage' })
  avatar: UImageDocument;

  @Prop()
  isOnline: boolean;

  @Prop()
  lastVisit: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  subscriptions: UserDocument[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UImage' }] })
  gallery: UImageDocument[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UPost' }] })
  posts: UPostDocument[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }] })
  chats: ChatDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
