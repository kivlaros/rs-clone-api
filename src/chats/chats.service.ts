import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { UserDocument } from 'src/users/schemas/user.schema';
import { MessageDto } from './dto/message.dto';
import { EventsService } from 'src/events/events.service';
import { NewMessage, NewMessageDocument } from './schemas/new-message.schema';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(NewMessage.name)
    private messageModel: Model<NewMessageDocument>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly eventsService: EventsService,
  ) {
    //this.checkCycleOfUnreadMesages();
  }

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
        const existChat = allChats.find(
          (e) =>
            e.users[0].id == targetUser.id || e.users[1].id == targetUser.id,
        );
        return { message: 'chat is already exist', chat: existChat.id };
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
    const allChatsArr = await this.chatModel.find().populate([
      {
        path: 'messages',
        populate: { path: 'author', populate: { path: 'avatar' } },
      },
      {
        path: 'users',
        populate: { path: 'avatar' },
      },
    ]);
    return allChatsArr
      .filter((e) => e.users[0].id == user.id || e.users[1].id == user.id)
      .filter((e) => e.messages.length)
      .sort(
        (a, b) =>
          b.messages.at(-1).date.valueOf() - a.messages.at(-1).date.valueOf(),
      );
  }

  async createMessage(req: Request, id: ObjectId, dto: MessageDto) {
    const userId = this.authService.tokenDecrypt(req);
    const user = await this.usersService.getUserById(userId);
    const chat = await this.chatModel.findById(id);
    const message = await this.messageModel.create({
      ...dto,
      isread: false,
      author: user._id,
      date: new Date(),
    });
    await chat.populate('messages');
    chat.messages.push(message); //???
    await chat.save();
    await chat.populate([
      {
        path: 'messages',
        populate: { path: 'author', populate: { path: 'avatar' } },
      },
      {
        path: 'users',
        populate: { path: 'avatar' },
      },
    ]);
    try {
      this.eventsService.emit(id.toString(), chat); //событие чата
      return chat.messages;
    } finally {
      this.setIsRead(chat.messages, userId._id);
      this.emitMessage(userId._id.toString(), chat);
    }
  }

  async getChatByID(id: ObjectId, req: Request) {
    const userId = this.authService.tokenDecrypt(req)._id;
    const chat = await this.chatModel.findById(id).populate([
      {
        path: 'messages',
        populate: { path: 'author', populate: { path: 'avatar' } },
      },
      {
        path: 'users',
        populate: { path: 'avatar' },
      },
    ]);
    try {
      return chat;
    } finally {
      this.setIsRead(chat.messages, userId);
    }
  }

  async setIsRead(messages: NewMessageDocument[], id: ObjectId) {
    const filtredMeassges = messages.filter((e) => e.author.id !== id);
    for (const message of filtredMeassges) {
      message.isread = true;
      await message.save();
    }
    const unreadCount = await this.getCurrentUnreadMassages(id.toString());
    this.eventsService.emit(id.toString(), {
      unread: unreadCount,
      sound: false,
    });
  }

  async emitMessage(id: string, chat: ChatDocument) {
    const targetId = chat.users.find((e) => e.id !== id).id;
    const unreadCount = await this.getCurrentUnreadMassages(targetId);
    this.eventsService.emit(targetId, { unread: unreadCount, sound: true });
  }

  async getUnRead(req: Request) {
    const userId = this.authService.tokenDecrypt(req);
    const user = await this.usersService.getUserById(userId);
    const result = await this.getCurrentUnreadMassages(user.id);
    return { unread: result };
  }

  async getCurrentUnreadMassages(userId: string) {
    const chats = await this.chatModel.find().populate(['messages', 'users']);
    const userChats = chats.filter((e) =>
      e.users.some((elem) => elem.id == userId),
    );
    return userChats.reduce((acc, e) => {
      acc += e.messages.reduce((acc, e) => {
        if (!e.isread && e.author._id.toString() !== userId) {
          acc += 1;
        }
        return acc;
      }, 0);
      return acc;
    }, 0);
  }

  checkCycleOfUnreadMesages() {
    let total = 0;
    setInterval(async () => {
      const value = await this.getCurrentUnreadMassages(
        '63f129bdbe00f20c1d59eb9a',
      );
      if (total !== value) {
        console.log('unreadMessages= ' + value);
        total = value;
      }
    }, 30000);
  }
}
