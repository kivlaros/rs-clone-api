import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { CommonAuthGuard } from 'src/auth/common-auth.guard';
import { ChatsService } from './chats.service';
import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { MessageDto } from './dto/message.dto';
import { EventsService } from 'src/events/events.service';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly eventsService: EventsService,
  ) {}

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

  @Sse('/sse/:id')
  sse(@Param('id') id: ObjectId) {
    return this.eventsService.subscribe(id.toString());
  }
}
