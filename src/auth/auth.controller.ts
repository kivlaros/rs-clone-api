import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { ResLoginUserDto } from './dto/res-login.dto';

@ApiTags('Регистрация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Вход выполнен успешно',
    type: ResLoginUserDto,
  })
  @Post('registration')
  @UsePipes(new ValidationPipe({ transform: true }))
  registrarion(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }

  @ApiOperation({ summary: 'Вход в систему' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 201,
    description: 'Вход выполнен успешно',
    type: ResLoginUserDto,
  })
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
