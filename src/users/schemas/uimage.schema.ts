import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { LikeDocument } from '../../likes/schemas/like.schema';
import { ApiProperty } from '@nestjs/swagger';
import { CommentDocument } from 'src/posts/schemas/comment.schema';

export type UImageDocument = HydratedDocument<UImage>;

@Schema()
export class UImage {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @ApiProperty()
  @Prop()
  date: Date;

  @ApiProperty()
  @Prop()
  imgLink: string;

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }] })
  likes: LikeDocument[];

  @ApiProperty()
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: CommentDocument[];
}

export const UImageSchema = SchemaFactory.createForClass(UImage);
