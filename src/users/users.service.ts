import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Like, LikeDocument } from './schemas/like.schema';
import { UImage, UImageDocument } from './schemas/uimage.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UImage.name) private imageModel: Model<UImageDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
  ) {}

  async createUser(dto: CreateUserDto) {
    return await this.userModel.create({ ...dto });
  }

  async getAllUsers() {
    return await this.userModel.find();
  }

  async getUserByUserName(username) {
    return await this.userModel.findOne({ username: username });
  }

  async deleteAllUsers() {
    return await this.userModel.deleteMany({});
  }

  async isUserInBase(id) {
    const user = await this.userModel.findById(id);
    return Boolean(user);
  }
}
