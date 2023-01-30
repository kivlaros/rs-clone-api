import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommonAuthGuard } from 'src/auth/common-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Request } from 'express';
import { ObjectId } from 'mongoose';

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

  @Post('images')
  @UseGuards(CommonAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  addImagesToGallery(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.usersService.addPhotosToGallery(req, files);
  }

  @Delete('/images/:id')
  @UseGuards(CommonAuthGuard)
  deleteImage(@Req() request: Request, @Param('id') id: ObjectId) {
    return this.usersService.deletImage(request, id);
  }
}
