import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  registrarion(@Body() dto: CreateUserDto) {
    return this.authService.registration(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
