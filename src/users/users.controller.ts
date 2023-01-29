import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
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
}
