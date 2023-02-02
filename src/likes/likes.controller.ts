import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CommonAuthGuard } from 'src/auth/common-auth.guard';
import { LikesService } from './likes.service';
import { Request } from 'express';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/image/:id')
  @UseGuards(CommonAuthGuard)
  postLikeToImage(@Req() req: Request, @Param('id') id: ObjectId) {
    return this.likesService.postLikeToImage(req, id);
  }

  @Post('/post/:id')
  @UseGuards(CommonAuthGuard)
  postLikeToPost(@Req() req: Request, @Param('id') id: ObjectId) {
    return this.likesService.postLikeToPost(req, id);
  }
}
