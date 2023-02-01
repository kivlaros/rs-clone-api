import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommonAuthGuard } from 'src/auth/common-auth.guard';
import { ChatsService } from './chats.service';
import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { MessageDto } from './dto/message.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post(':id')
  @UseGuards(CommonAuthGuard)
  create(@Req() req: Request, @Param('id') id: ObjectId) {
    return this.chatsService.create(req, id);
  }

  @Get()
  @UseGuards(CommonAuthGuard)
  getAllUserChats(@Req() req: Request) {
    return this.chatsService.getAllUserChats(req);
  }

  @Post('/message/:id')
  @UseGuards(CommonAuthGuard)
  createMessage(
    @Req() req: Request,
    @Param('id') id: ObjectId,
    @Body() dto: MessageDto,
  ) {
    return this.chatsService.createMessage(req, id, dto);
  }
}
