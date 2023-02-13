import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommonAuthGuard } from 'src/auth/common-auth.guard';
import { PostsService } from './posts.service';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/crate-post.dto';
import { ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(CommonAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(req, files, dto);
  }

  @Get()
  @UseGuards(CommonAuthGuard)
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Delete(':id')
  @UseGuards(CommonAuthGuard)
  deletePost(@Req() req: Request, @Param('id') id: ObjectId) {
    return this.postsService.deletePost(req, id);
  }

  @Get(':id')
  @UseGuards(CommonAuthGuard)
  getUserPosts(@Param('id') id: ObjectId) {
    return this.postsService.getUserPosts(id);
  }

  @Post('/comment/:id')
  @UseGuards(CommonAuthGuard)
  createComment(
    @Req() req: Request,
    @Body() dto: CreateCommentDto,
    @Param('id') id: ObjectId,
  ) {
    console.log('fffffff');
    return this.postsService.createComment(req, dto, id);
  }
}
