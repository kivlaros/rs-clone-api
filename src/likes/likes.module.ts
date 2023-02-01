import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './schemas/like.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    UsersModule,
    AuthModule,
    PostsModule,
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
