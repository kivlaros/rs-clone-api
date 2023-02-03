import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CommonAuthGuard } from 'src/auth/common-auth.guard';
import { UsersService } from './users.service';
import { Request } from 'express';
import { ObjectId } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(CommonAuthGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @UseGuards(CommonAuthGuard)
  getUser(@Param('id') id: ObjectId) {
    return this.usersService.getUserInDetail(id);
  }

  @Get('images')
  @UseGuards(CommonAuthGuard)
  getAllUserImages(@Req() req: Request) {
    return this.usersService.getAllUserImages(req);
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

  @Post('avatar')
  @UseGuards(CommonAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(request, file);
  }

  @Delete('avatar')
  @UseGuards(CommonAuthGuard)
  deleteAvatar(@Req() request: Request) {
    return this.usersService.deleteAvatar(request);
  }

  @Post('/subs/:id')
  @UseGuards(CommonAuthGuard)
  addInSubs(@Req() request: Request, @Param('id') id: ObjectId) {
    return this.usersService.addInSubs(request, id);
  }

  @Delete('/subs/:id')
  @UseGuards(CommonAuthGuard)
  deleteFromSubs(@Req() request: Request, @Param('id') id: ObjectId) {
    return this.usersService.deleteFromSubs(request, id);
  }
}
