import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop()
  date: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
