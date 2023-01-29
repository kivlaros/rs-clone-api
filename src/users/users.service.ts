import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FilesService } from 'src/files/files.service';
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
    private readonly filesService: FilesService,
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

  async addPhotosToGallery(id: ObjectId, files: Array<Express.Multer.File>) {
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
    return user.populate('gallery');
  }

  async getAllPhotos() {
    return await this.imageModel.find();
  }
}
