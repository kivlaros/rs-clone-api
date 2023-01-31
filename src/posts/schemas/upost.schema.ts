import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { LikeDocument } from 'src/users/schemas/like.schema';
import { CommentDocument } from './comment.schema';

export type UPostDocument = HydratedDocument<UPost>;

@Schema()
export class UPost {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop()
  date: Date;

  @Prop()
  headline: string;

  @Prop()
  text: string;

  @Prop()
  images: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }] })
  likes: LikeDocument[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: CommentDocument[];
}

export const UPostSchema = SchemaFactory.createForClass(UPost);
