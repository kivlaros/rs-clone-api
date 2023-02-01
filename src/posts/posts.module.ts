import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UPost, UPostSchema } from './schemas/upost.schema';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UPost.name, schema: UPostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    AuthModule,
    FilesModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
