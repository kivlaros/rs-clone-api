import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { UImage } from 'src/users/schemas/uimage.schema';
import { Message } from 'src/chats/schemas/message.schema';
import { Like } from 'src/users/schemas/like.schema';

export type UPostDocument = HydratedDocument<UPost>;

@Schema()
export class UPost {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop()
  date: Date;

  @Prop()
  headline: string;

  @Prop()
  text: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UImage' }] })
  images: UImage[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Like' })
  likes: Like[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  comments: Message[];
}

export const UPostSchema = SchemaFactory.createForClass(UPost);
