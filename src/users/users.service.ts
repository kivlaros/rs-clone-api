import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UImage, UImageDocument } from './schemas/uimage.schema';
import { User, UserDocument } from './schemas/user.schema';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { ThemeDto } from './dto/theme.dto';

type TokenDecryptType = {
  username: string;
  _id: ObjectId;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UImage.name) private imageModel: Model<UImageDocument>,
    private readonly filesService: FilesService,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userModel.create({
      ...dto,
      avatar: this.filesService.userPlceholder.id,
    });
    const img = await this.imageModel.create({
      author: user.id,
      imgLink: 'user_placeholder.jpg',
      date: new Date(),
    });
    user.avatar = img.id;
    await user.save();
    return user;
  }

  async getUserById(id) {
    try {
      return await this.userModel.findById(id);
    } catch {
      throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    }
  }

  async getUserInDetail(id: ObjectId) {
    try {
      return await this.userModel.findById(id).populate([
        {
          path: 'subscriptions',
          populate: { path: 'avatar' },
        },
        {
          path: 'gallery',
        },
        {
          path: 'posts',
        },
        {
          path: 'avatar',
        },
        {
          path: 'subscribers',
          populate: { path: 'avatar' },
        },
      ]);
    } catch {
      throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    }
  }
  async createDefaultAvatar(id: string) {
    const img = await this.imageModel.create({
      author: id,
      date: new Date(),
      imgLink: this.filesService.userPlceholder.link,
    });
    return img;
  }

  async setDefaultAvatar() {
    const users = await this.userModel.find();
    for (const user of users) {
      user.avatar = await this.createDefaultAvatar(user.id);
      await user.save();
    }
  }

  async getAllUsers() {
    return await this.userModel
      .find()
      .populate(['gallery', 'posts', 'subscriptions', 'avatar']);
  }

  async getUserByUserName(username: string) {
    return await this.userModel.findOne({ username: username });
  }

  async deleteAllUsers() {
    return await this.userModel.deleteMany({});
  }

  async deleteAllImages() {
    return await this.imageModel.deleteMany({});
  }

  async getImageById(id) {
    return await this.imageModel.findById(id).populate('author');
  }

  async isUserInBase(id) {
    const user = await this.userModel.findById(id);
    return Boolean(user);
  }

  async addPhotosToGallery(req: Request, files: Array<Express.Multer.File>) {
    const id = this.tokenDecrypt(req)._id;
    //await this.deleteAllImages();
    if (!files || !files.length) {
      throw new HttpException(
        'There are no files to add',
        HttpStatus.FORBIDDEN,
      );
    }
    const user = await this.userModel.findById(id);
    for (const e of files) {
      const fileLink = await this.filesService.createFile(e);
      const image = await this.imageModel.create({
        author: user._id,
        date: new Date(),
        imgLink: fileLink,
      });
      user.gallery.push(image.id);
    }
    await user.save();
    return this.getUserIdImages(user.id);
  }

  async deletImage(req: Request, id: ObjectId) {
    //Надо реализавать удаление статики
    const username = this.tokenDecrypt(req).username;
    const user = await this.userModel
      .findOne({ username: username })
      .populate('gallery');
    try {
      const image = await this.imageModel.findById(id).populate('author');
      if (!image || username !== image.author.username) {
        throw new HttpException(
          'The image does not exist or you do not have enough rights',
          HttpStatus.FORBIDDEN,
        );
      }
      const userImagesArr = user.gallery.filter((e) => e.id !== image.id);
      user.gallery = [...userImagesArr];
      await user.save();
      await image.delete();
      return await this.getUserIdImages(user.id);
    } catch {
      throw new HttpException(
        'The image does not exist or you do not have enough rights',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getAllUserImages(req: Request) {
    const userId = this.tokenDecrypt(req)._id;
    return await this.imageModel.find({ author: userId });
  }

  async getUserIdImages(userId: ObjectId) {
    const user = await this.userModel.findById(userId).populate('avatar');
    const images = await this.imageModel.find({ author: userId }).populate([
      {
        path: 'author',
        populate: { path: 'avatar' },
      },
      {
        path: 'likes',
      },
      {
        path: 'comments',
        populate: { path: 'author', populate: { path: 'avatar' } },
      },
    ]);
    return images
      .filter(
        (e) =>
          e.imgLink !== this.filesService.userPlceholder.link &&
          e.id !== user.avatar.id,
      )
      .reverse();
  }

  async uploadAvatar(request: Request, file: Express.Multer.File) {
    const userId = this.tokenDecrypt(request)._id;
    const user = await this.userModel.findById(userId);
    const fileLink = await this.filesService.createFile(file);
    const image = await this.imageModel.create({
      author: user._id,
      date: new Date(),
      imgLink: fileLink,
    });
    user.avatar = image;
    await user.save();
    return image;
  }

  async deleteAvatar(request: Request) {
    //Надо реализавать удаление статики
    const userId = this.tokenDecrypt(request)._id;
    const user = await this.userModel.findById(userId).populate('avatar');
    await user.avatar.delete();
    user.avatar = undefined;
    await user.save();
    return { message: 'avatar delete is succsess' };
  }

  async addInSubs(request: Request, subId: ObjectId) {
    const userId = this.tokenDecrypt(request)._id;
    const user = await this.userModel
      .findById(userId)
      .populate('subscriptions');
    const isSubs = user.subscriptions.some((e) => e.id == subId);
    if (user.id == subId || isSubs) {
      throw new HttpException(
        'You have already subscribed to this person',
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      const userSub = await this.userModel.findById(subId);
      user.subscriptions.push(userSub);
      userSub.subscribers.push(user);
      userSub.save();
      await user.save();
      return await this.getUserInDetail(subId);
    } catch (e) {
      throw new HttpException(
        'The user id is specified incorrectly' + `${e}`,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async deleteFromSubs(request: Request, subsId: ObjectId) {
    try {
      const userId = this.tokenDecrypt(request)._id;
      const user = await this.userModel
        .findById(userId)
        .populate('subscriptions');
      const subsArr = user.subscriptions.filter((e) => e.id !== subsId);
      user.subscriptions = [...subsArr];
      await user.save();
      const userTarget = await this.userModel
        .findById(subsId)
        .populate('subscribers');
      const targetSubsArr = userTarget.subscribers.filter(
        (e) => e.id !== userId,
      );
      userTarget.subscribers = [...targetSubsArr];
      await userTarget.save();
      return await this.getUserInDetail(subsId);
    } catch {
      throw new HttpException(
        "you can't delete something that isn't there",
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async changeTheme(request: Request, dto: ThemeDto) {
    if (!dto || !dto.link) {
      throw new HttpException('no data', HttpStatus.FORBIDDEN);
    }
    const userId = this.tokenDecrypt(request)._id;
    const user = await this.userModel.findById(userId);
    user.background = dto.link;
    await user.save();
    return { link: user.background };
  }

  async updateLastActivity(userId: string) {
    const user = await this.userModel.findById(userId);
    if (user.lastVisit) {
      user.lastVisit = new Date();
      await user.save();
    }
  }

  tokenDecrypt(req: Request): TokenDecryptType {
    const token = req.headers.authorization.split(' ')[1];
    const data = this.jwtService.decode(token) as TokenDecryptType;
    return data;
  }
}
