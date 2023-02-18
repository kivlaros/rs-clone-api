import { EventsModule } from './../events/events.module';
import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { NewMessage, NewMessageSchema } from './schemas/new-message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([
      { name: NewMessage.name, schema: NewMessageSchema },
    ]),
    UsersModule,
    AuthModule,
    EventsModule,
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
