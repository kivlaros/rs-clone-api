import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { LikeDocument } from './like.schema';

export type UImageDocument = HydratedDocument<UImage>;

@Schema()
export class UImage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop()
  date: Date;

  @Prop()
  imgLink: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Like' })
  likes: LikeDocument[];
}

export const UImageSchema = SchemaFactory.createForClass(UImage);
