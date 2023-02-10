import * as bcrypt from 'bcryptjs';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login.dto';
import { Request } from 'express';
import { ObjectId } from 'mongoose';

export type TokenDecryptType = {
  username: string;
  _id: ObjectId;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.updateOnlineStatus();
  }

  async registration(dto: CreateUserDto) {
    const candidate = await this.usersService.getUserByUserName(dto.username);
    if (candidate) {
      throw new HttpException(
        'User with this username already exists',
        HttpStatus.FORBIDDEN,
      );
    }
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.usersService.createUser({
      ...dto,
      password: hashPassword,
    });
    const payload = { username: user.username, _id: user._id };
    const token = this.jwtService.sign(payload);
    return { _id: user._id, token };
  }

  async login(dto: LoginUserDto) {
    const user = await this.validateUser(dto);
    const payload = { username: user.username, _id: user._id };
    const token = this.jwtService.sign(payload);
    return { _id: user._id, token };
  }

  private async validateUser(dto: LoginUserDto) {
    const user = await this.usersService.getUserByUserName(dto.username);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Incorrect email or password',
      });
    }
    const passwordsMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordsMatch) {
      throw new UnauthorizedException({
        message: 'Incorrect email or password',
      });
    }
    return user;
  }

  tokenDecrypt(req: Request): TokenDecryptType {
    const token = req.headers.authorization.split(' ')[1];
    const data = this.jwtService.decode(token) as TokenDecryptType;
    return data;
  }

  updateOnlineStatus() {
    setInterval(async () => {
      const users = await this.usersService.getAllUsers();
      for (const user of users) {
        if (!user.lastVisit) {
          user.lastVisit = new Date();
        }
        const now = new Date().valueOf();
        const last = new Date(user.lastVisit).valueOf();
        const timeDife = (now - last) / 1000;
        console.log(timeDife, user.isOnline);
        if (timeDife > 450) {
          user.isOnline = false;
        } else {
          user.isOnline = true;
        }
        user.save();
      }
    }, 100000);
  }
}
