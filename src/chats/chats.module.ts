import { EventsModule } from './../events/events.module';
import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Message } from './schemas/message.schema';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { CommentSchema } from 'src/posts/schemas/comment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: CommentSchema }]),
    UsersModule,
    AuthModule,
    EventsModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
