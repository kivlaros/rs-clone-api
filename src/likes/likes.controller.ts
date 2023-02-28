import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CommonAuthGuard } from 'src/auth/common-auth.guard';
import { LikesService } from './likes.service';
import { Request } from 'express';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UImage } from 'src/users/schemas/uimage.schema';
import { UPost } from 'src/posts/schemas/upost.schema';

@ApiTags('Лайки')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({ summary: 'Поставить лайк под фото' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id фото',
  })
  @ApiResponse({
    status: 201,
    description:
      'Ответ содержит объект фото с массивом лаков если лайк был уже поставлен ранее то он удалится',
    type: UImage,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Post('/image/:id')
  @UseGuards(CommonAuthGuard)
  postLikeToImage(@Req() req: Request, @Param('id') id: ObjectId) {
    return this.likesService.postLikeToImage(req, id);
  }

  @ApiOperation({ summary: 'Поставить лайк под постом' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id поста',
  })
  @ApiResponse({
    status: 201,
    description:
      'Ответ содержит объект постом с массивом лаков если лайк был уже поставлен ранее то он удалится',
    type: UPost,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Post('/post/:id')
  @UseGuards(CommonAuthGuard)
  postLikeToPost(@Req() req: Request, @Param('id') id: ObjectId) {
    return this.likesService.postLikeToPost(req, id);
  }
}
