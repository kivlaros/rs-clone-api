import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { ChatsModule } from './chats/chats.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://jh0ske:e0Jo3mvxwArkK1PB@cluster0.gebarog.mongodb.net/?retryWrites=true&w=majority',
    ),
    UsersModule,
    PostsModule,
    ChatsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
