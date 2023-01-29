import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Like } from './like.schema';

export type UImageDocument = HydratedDocument<UImage>;

@Schema()
export class UImage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop()
  date: Date;

  @Prop()
  imgLink: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Like' })
  likes: Like[];
}

export const UImageSchema = SchemaFactory.createForClass(UImage);
