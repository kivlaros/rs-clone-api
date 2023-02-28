import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @ApiProperty()
  @Prop()
  date: Date;

  @ApiProperty()
  @Prop()
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
