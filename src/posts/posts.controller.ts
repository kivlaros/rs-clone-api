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
} from '@nestjs/common';
import { CommonAuthGuard } from 'src/auth/common-auth.guard';
import { PostsService } from './posts.service';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/crate-post.dto';
import { ObjectId } from 'mongoose';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(CommonAuthGuard)
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
}
