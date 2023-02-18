import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ChatsModule } from './chats/chats.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LikesModule } from './likes/likes.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
    }),
    MongooseModule.forRoot(
      'mongodb+srv://jh0ske:xUMaNI8PBaxnea4R@vk-api.liwy0ht.mongodb.net/?retryWrites=true&w=majority',
    ),
    UsersModule,
    PostsModule,
    ChatsModule,
    AuthModule,
    FilesModule,
    LikesModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
