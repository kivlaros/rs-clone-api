import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  users: User;

  @Prop()
  date: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
