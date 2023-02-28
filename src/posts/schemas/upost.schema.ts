import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { LikeDocument } from 'src/likes/schemas/like.schema';
import { CommentDocument } from './comment.schema';
import { ApiProperty } from '@nestjs/swagger';

export type UPostDocument = HydratedDocument<UPost>;

@Schema()
export class UPost {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @ApiProperty()
  @Prop()
  date: Date;

  @ApiProperty()
  @Prop()
  headline: string;

  @ApiProperty()
  @Prop()
  text: string;

  @ApiProperty()
  @Prop()
  images: string[];

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }] })
  likes: LikeDocument[];

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: CommentDocument[];
}

export const UPostSchema = SchemaFactory.createForClass(UPost);
