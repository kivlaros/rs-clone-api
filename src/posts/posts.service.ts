import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { UPost, UPostDocument } from './schemas/upost.schema';
import { Request } from 'express';
import { CreatePostDto } from './dto/crate-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { marked } from 'marked';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(UPost.name) private postModel: Model<UPostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly filesService: FilesService,
  ) {}

  async create(
    req: Request,
    files: Array<Express.Multer.File>,
    dto: CreatePostDto,
  ) {
    const userId = this.authService.tokenDecrypt(req);
    const user = await this.usersService.getUserById(userId);
    const filesArr: string[] = [];
    for (const e of files) {
      const link = await this.filesService.createFile(e);
      filesArr.push(link);
    }
    const post = await this.postModel.create({
      headline: dto.headline,
      text: marked.parse(dto.text),
      author: user._id,
      images: filesArr,
      date: new Date(),
    });
    user.posts.push(post);
    await user.save();
    return await this.getUserPosts(user.id);
  }

  async getAllPosts() {
    return await this.postModel.find().populate([
      {
        path: 'comments',
        populate: { path: 'author', populate: { path: 'avatar' } },
      },
      {
        path: 'author',
        populate: { path: 'avatar' },
      },
    ]);
  }

  async getPostById(id) {
    return await this.postModel.findById(id).populate('author');
  }

  async getUserPosts(id: ObjectId) {
    const posts = await this.postModel.find({ author: id }).populate([
      {
        path: 'comments',
        populate: { path: 'author', populate: { path: 'avatar' } },
      },
      {
        path: 'author',
        populate: { path: 'avatar' },
      },
    ]);
    return posts.reverse();
  }

  async deletePost(req: Request, postId: ObjectId) {
    const userId = this.authService.tokenDecrypt(req);
    const user = await this.usersService.getUserById(userId);
    try {
      const post = await this.postModel.findById(postId).populate('author');
      if (post.author.id !== user.id) {
        throw new HttpException(
          'The post does not exist or you do not have enough rights',
          HttpStatus.FORBIDDEN,
        );
      }
      await user.populate('posts');
      const postsArr = user.posts.filter((e) => e.id !== post.id);
      user.posts = [...postsArr];
      await user.save();
      return await post.delete();
    } catch {
      throw new HttpException(
        'The post does not exist or you do not have enough rights',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async createComment(req: Request, dto: CreateCommentDto, postId: ObjectId) {
    const userId = this.authService.tokenDecrypt(req);
    const user = await this.usersService.getUserById(userId);
    try {
      const post = await this.postModel.findById(postId);
      const comment = await this.commentModel.create({
        text: dto.text,
        date: new Date(),
        author: user._id,
      });
      await post.populate('comments');
      post.comments.push(comment);
      await post.save();
      await post.populate([
        {
          path: 'comments',
          populate: { path: 'author', populate: { path: 'avatar' } },
        },
      ]);
      return post.comments;
    } catch {
      throw new HttpException(
        'The post does not exist or you do not have enough rights',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async createImgComment(req: Request, dto: CreateCommentDto, id: ObjectId) {
    try {
      const userId = this.authService.tokenDecrypt(req);
      const user = await this.usersService.getUserById(userId);
      const image = await this.usersService.getImageById(id);
      const comment = await this.commentModel.create({
        text: dto.text,
        date: new Date(),
        author: user._id,
      });
      image.comments.push(comment.id);
      await image.save();
      await image.populate([
        {
          path: 'comments',
          populate: { path: 'author', populate: { path: 'avatar' } },
        },
      ]);
      return image.comments;
    } catch {
      throw new HttpException(
        'The image does not exist or you do not have enough rights',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
