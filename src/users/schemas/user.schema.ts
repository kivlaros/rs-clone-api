import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UPost } from 'src/posts/schemas/upost.schema';
import { UImage } from './uimage.schema';

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
  avatar: UImage;

  @Prop()
  isOnline: boolean;

  @Prop()
  lastVisit: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  subscriptions: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UImage' }] })
  gallery: UImage[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UPost' }] })
  posts: UPost[];

  @Prop()
  chats: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
