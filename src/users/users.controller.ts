import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { CommonAuthGuard } from 'src/auth/common-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Get()
  @UseGuards(CommonAuthGuard)
  getAllUsres() {
    return this.usersService.getAllUsers();
  }

  @Delete()
  deleteAllUsres() {
    return this.usersService.deleteAllUsers();
  }

  @Post('/gallery/:id')
  @UseInterceptors(FilesInterceptor('files'))
  addPhotosToGallery(
    @Param('id') id: ObjectId,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.usersService.addPhotosToGallery(id, files);
  }

  @Get('photos')
  getAllPhotos() {
    return this.usersService.getAllPhotos();
  }
}
