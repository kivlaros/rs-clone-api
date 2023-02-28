import { UImage } from 'src/users/schemas/uimage.schema';
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
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UPost } from './schemas/upost.schema';

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Создание новго поста' })
  @ApiBody({
    type: CreatePostDto,
    description: 'в качестве body используется FormData (files: file)',
  })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит массив своих постов',
    type: [UPost],
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
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

  @ApiOperation({ summary: 'Получение всех постов' })
  @ApiResponse({
    status: 201,
    description:
      'Ответ содержит массив постов все пользователей отсортированный по дате',
    type: [UPost],
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Get()
  @UseGuards(CommonAuthGuard)
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @ApiOperation({ summary: 'Удаление поста(можно удалять только свои посты)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id поста',
  })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит массив своих постов',
    type: [UPost],
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Delete(':id')
  @UseGuards(CommonAuthGuard)
  deletePost(@Req() req: Request, @Param('id') id: ObjectId) {
    return this.postsService.deletePost(req, id);
  }

  @ApiOperation({ summary: 'Получение постов пользователя по id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id пользователя',
  })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит массив постов пользователя',
    type: [UPost],
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Get(':id')
  @UseGuards(CommonAuthGuard)
  getUserPosts(@Param('id') id: ObjectId) {
    return this.postsService.getUserPosts(id);
  }

  @ApiOperation({ summary: 'Добавление коментария к посту' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id поста',
  })
  @ApiResponse({
    status: 201,
    description: 'Ответ объект поста с массивом коментариев',
    type: UPost,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Post('/comment/:id')
  @UseGuards(CommonAuthGuard)
  createComment(
    @Req() req: Request,
    @Body() dto: CreateCommentDto,
    @Param('id') id: ObjectId,
  ) {
    return this.postsService.createComment(req, dto, id);
  }

  @ApiOperation({ summary: 'Добавление коментария к фото' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id фото',
  })
  @ApiResponse({
    status: 201,
    description: 'Ответ объект фото с массивом коментариев',
    type: UImage,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Post('/image/comment/:id')
  @UseGuards(CommonAuthGuard)
  createImgComment(
    @Req() req: Request,
    @Body() dto: CreateCommentDto,
    @Param('id') id: ObjectId,
  ) {
    return this.postsService.createImgComment(req, dto, id);
  }
}
