import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { Like, LikeDocument } from './schemas/like.schema';
import { Request } from 'express';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UImageDocument } from 'src/users/schemas/uimage.schema';
import { UPostDocument } from 'src/posts/schemas/upost.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly postsService: PostsService,
  ) {}

  async postLikeToImage(req: Request, imageId: ObjectId) {
    const userId = this.authService.tokenDecrypt(req);
    const user = await this.usersService.getUserById(userId);
    try {
      const image = await this.usersService.getImageById(imageId);
      await image.populate([
        {
          path: 'comments',
          populate: { path: 'author', populate: { path: 'avatar' } },
        },
        {
          path: 'author',
          populate: { path: 'avatar' },
        },
        {
          path: 'likes',
        },
      ]);
      return await this.likesAddOrDelete(user, image);
    } catch {
      throw new HttpException(
        'The image does not exist or you do not have enough rights',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async postLikeToPost(req: Request, postId: ObjectId) {
    const userId = this.authService.tokenDecrypt(req);
    const user = await this.usersService.getUserById(userId);
    try {
      const post = await this.postsService.getPostById(postId);
      await post.populate([
        {
          path: 'comments',
          populate: { path: 'author', populate: { path: 'avatar' } },
        },
        {
          path: 'author',
          populate: { path: 'avatar' },
        },
        {
          path: 'likes',
        },
      ]);
      return await this.likesAddOrDelete(user, post);
    } catch {
      throw new HttpException(
        'The post does not exist or you do not have enough rights',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async likesAddOrDelete(
    user: UserDocument,
    target: UImageDocument | UPostDocument,
  ) {
    const isLiked = target.likes.some((e) => e.author.toString() == user.id);
    if (isLiked) {
      const likesArr = target.likes.filter(
        (e) => e.author.toString() !== user.id,
      );
      target.likes = [...likesArr];
      await target.save();
      const like = await this.likeModel.findOne({ author: user.id });
      await like.delete();
    } else {
      const like = await this.likeModel.create({
        author: user._id,
        date: new Date(),
      });
      target.likes.push(like);
      await target.save();
    }
    return target;
  }

  async deleteAllLikes() {
    await this.likeModel.deleteMany({});
  }
}
