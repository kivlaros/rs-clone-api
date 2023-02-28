import { NewMessage } from './schemas/new-message.schema';
import {
  Body,
  Controller,
  Get,
  Header,
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
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRespChatDto } from './dto/create-resp.dto';
import { Chat } from './schemas/chat.schema';
import { UnreadRespDto } from './dto/unread-resp.dto';

@ApiTags('Чаты')
@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly eventsService: EventsService,
  ) {}

  @ApiOperation({ summary: 'Создание чата' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id целевого пользователя',
  })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит id пользователей и id чата',
    type: CreateRespChatDto,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Post(':id')
  @UseGuards(CommonAuthGuard)
  create(@Req() req: Request, @Param('id') id: ObjectId) {
    return this.chatsService.create(req, id);
  }

  @ApiOperation({ summary: 'Получение чатов' })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит массив собственных чатов',
    type: Chat,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Get()
  @UseGuards(CommonAuthGuard)
  getAllUserChats(@Req() req: Request) {
    return this.chatsService.getAllUserChats(req);
  }

  @ApiOperation({ summary: 'Поучение количества непрочитных сообщений' })
  @ApiResponse({
    status: 201,
    description: 'Тут и так все ясно',
    type: UnreadRespDto,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Get('unread')
  @UseGuards(CommonAuthGuard)
  getUnRead(@Req() req: Request) {
    return this.chatsService.getUnRead(req);
  }

  @ApiOperation({ summary: 'Получение чата по id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id чата',
  })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит чат с массивом сообщений и участиниками',
    type: Chat,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Get(':id')
  @UseGuards(CommonAuthGuard)
  getChatById(@Param('id') id: ObjectId, @Req() req: Request) {
    return this.chatsService.getChatByID(id, req);
  }

  @ApiOperation({ summary: 'Создание и отправка сообщения в чат' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id чата',
  })
  @ApiBody({ type: MessageDto })
  @ApiResponse({
    status: 201,
    description: 'Отввет содержит обноленный массив сообщений данного чата',
    type: [NewMessage],
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Post('/message/:id')
  @UseGuards(CommonAuthGuard)
  createMessage(
    @Req() req: Request,
    @Param('id') id: ObjectId,
    @Body() dto: MessageDto,
  ) {
    return this.chatsService.createMessage(req, id, dto);
  }

  @ApiOperation({ summary: 'Лайв обновление чата через SSE' })
  @ApiParam({
    name: 'id',
    required: true,
    description:
      'id чата или id пользователя(выполняет функции обновления чатов в лайв режиме и боновление непрочитаных сообщений)',
  })
  @ApiResponse({
    status: 201,
    description: 'Отввет содержит обноленный массив сообщений данного чата',
    type: [NewMessage],
  })
  @Sse('/sse/:id')
  @Header('X-Accel-Buffering', 'no')
  sse(@Param('id') id: ObjectId) {
    return this.eventsService.subscribe(id.toString());
  }
}
