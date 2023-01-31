import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Like, LikeDocument } from './schemas/like.schema';
import { UImage, UImageDocument } from './schemas/uimage.schema';
import { User, UserDocument } from './schemas/user.schema';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

type TokenDecryptType = {
  username: string;
  _id: ObjectId;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UImage.name) private imageModel: Model<UImageDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    private readonly filesService: FilesService,
    private jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    return await this.userModel.create({ ...dto });
  }

  async getAllUsers() {
    return await this.userModel.find();
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
    return user;
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
      return { message: `image delete is succsess` };
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
      await user.save();
      return user.subscriptions;
    } catch {
      throw new HttpException(
        'The user id is specified incorrectly',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async deleteFromSubs(request: Request, subsId: ObjectId) {
    const userId = this.tokenDecrypt(request)._id;
    const user = await this.userModel
      .findById(userId)
      .populate('subscriptions');
    const subsArr = user.subscriptions.filter((e) => e.id !== subsId);
    user.subscriptions = [...subsArr];
    await user.save();
    return user.subscriptions;
  }

  tokenDecrypt(req: Request): TokenDecryptType {
    const token = req.headers.authorization.split(' ')[1];
    const data = this.jwtService.decode(token) as TokenDecryptType;
    return data;
  }
}
