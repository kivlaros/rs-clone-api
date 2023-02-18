import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';

export type NewMessageDocument = HydratedDocument<NewMessage>;

@Schema()
export class NewMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop()
  date: Date;

  @Prop()
  text: string;

  @Prop()
  isread: boolean;
}

export const NewMessageSchema = SchemaFactory.createForClass(NewMessage);
