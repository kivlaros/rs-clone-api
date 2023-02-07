import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { MessageDto } from './dto/message.dto';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly eventsService: EventsService,
  ) {}

  async create(req: Request, targetId: ObjectId) {
    const userId = this.authService.tokenDecrypt(req);
    const user = await this.usersService.getUserById(userId);
    try {
      const targetUser = await this.usersService.getUserById(targetId);
      const allChats = await this.getUserChats(user);
      const isChatAlready = allChats.some(
        (e) => e.users[0].id == targetUser.id || e.users[1].id == targetUser.id,
      );
      if (isChatAlready) {
        throw new HttpException('Chat already exist', HttpStatus.BAD_REQUEST);
      }
      const chat = await this.chatModel.create({
        users: [user._id, targetUser._id],
      });
      await user.populate('chats');
      user.chats.push(chat);
      await user.save();
      await targetUser.populate('chats');
      targetUser.chats.push(chat);
      await targetUser.save();
      return {
        message: 'chat is created',
        user: user.id,
        target: targetUser.id,
        chat: chat.id,
      };
    } catch (e) {
      throw new HttpException(`${e}`, HttpStatus.FORBIDDEN);
    }
  }

  async getAllUserChats(req: Request) {
    const userId = this.authService.tokenDecrypt(req);
    const user = await this.usersService.getUserById(userId);
    return await this.getUserChats(user);
  }

  async getUserChats(user: UserDocument) {
    const allChatsArr = await this.chatModel.find().populate('users');
    return allChatsArr.filter(
      (e) => e.users[0].id == user.id || e.users[1].id == user.id,
    );
  }

  async createMessage(req: Request, id: ObjectId, dto: MessageDto) {
    const userId = this.authService.tokenDecrypt(req);
    const user = await this.usersService.getUserById(userId);
    const chat = await this.chatModel.findById(id);
    const message = await this.messageModel.create({
      ...dto,
      author: user._id,
      date: new Date(),
    });
    await chat.populate('messages');
    chat.messages.push(message); //???
    await chat.save();
    this.eventsService.emit(id.toString(), chat); //событие чата
    return chat.messages;
  }

  async getChatByID(id: ObjectId) {
    return await this.chatModel.findById(id).populate('messages');
  }
}
