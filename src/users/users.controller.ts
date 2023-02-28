import { UImage } from 'src/users/schemas/uimage.schema';
import { User } from 'src/users/schemas/user.schema';
import { ThemeDto } from './dto/theme.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UPost } from 'src/posts/schemas/upost.schema';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит массив пользователей',
    type: [User],
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Get()
  @UseGuards(CommonAuthGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит подробный объект пользователя',
    type: User,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id пользователя',
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Get(':id')
  @UseGuards(CommonAuthGuard)
  getUser(@Param('id') id: ObjectId) {
    return this.usersService.getUserInDetail(id);
  }

  @ApiOperation({ summary: 'Получение своих фото' })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит массив фото',
    type: [UImage],
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Get('images')
  @UseGuards(CommonAuthGuard)
  getAllUserImages(@Req() req: Request) {
    return this.usersService.getAllUserImages(req);
  }

  @ApiOperation({ summary: 'Получение фотографий пользователя по id' })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит массив фото',
    type: [UImage],
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id пользователя',
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Get('/images/:id')
  @UseGuards(CommonAuthGuard)
  getUserIdImages(@Param('id') id: ObjectId) {
    return this.usersService.getUserIdImages(id);
  }

  @ApiOperation({ summary: 'Добавление фото' })
  @ApiBody({
    description: 'в качестве body используется FormData (files: file)',
  })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит массив своих фото',
    type: [UImage],
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Post('images')
  @UseGuards(CommonAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  addImagesToGallery(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.usersService.addPhotosToGallery(req, files);
  }

  @ApiOperation({ summary: 'Удаление своих фото' })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит массив фото',
    type: [UImage],
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id фотографии',
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Delete('/images/:id')
  @UseGuards(CommonAuthGuard)
  deleteImage(@Req() request: Request, @Param('id') id: ObjectId) {
    return this.usersService.deletImage(request, id);
  }

  @ApiOperation({ summary: 'Смена аватара' })
  @ApiBody({
    description: 'в качестве body используется FormData (files: file)',
  })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит объект фото',
    type: UImage,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Post('avatar')
  @UseGuards(CommonAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(request, file);
  }

  @ApiOperation({ summary: 'Удаление своего аватара(не использовать!!!!!)' })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит удаленный объект(не использовать!!!!!)',
    type: UImage,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Delete('avatar')
  @UseGuards(CommonAuthGuard)
  deleteAvatar(@Req() request: Request) {
    return this.usersService.deleteAvatar(request);
  }

  @ApiOperation({ summary: 'Подписаться на пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит объект User(вы) с массивом подписок',
    type: User,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id целевого пользователя',
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Post('/subs/:id')
  @UseGuards(CommonAuthGuard)
  addInSubs(@Req() request: Request, @Param('id') id: ObjectId) {
    return this.usersService.addInSubs(request, id);
  }

  @ApiOperation({ summary: 'Отписаться от пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Ответ содержит объект User(вы) с массивом подписок',
    type: User,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id целевого пользователя',
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Delete('/subs/:id')
  @UseGuards(CommonAuthGuard)
  deleteFromSubs(@Req() request: Request, @Param('id') id: ObjectId) {
    return this.usersService.deleteFromSubs(request, id);
  }

  @ApiOperation({ summary: 'Смена фона' })
  @ApiBody({
    type: ThemeDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Ответ ссылку на новый фон',
    type: ThemeDto,
  })
  @ApiHeader({
    name: 'authoriation',
    required: true,
    description: 'Используйте header типа Bearer token',
  })
  @Put('theme')
  @UseGuards(CommonAuthGuard)
  changeTheme(@Req() request: Request, @Body() dto: ThemeDto) {
    return this.usersService.changeTheme(request, dto);
  }
}
