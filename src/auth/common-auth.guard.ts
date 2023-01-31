import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

type UserType = {
  username: string;
  _id: string;
};

@Injectable()
export class CommonAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'The user is not logged in',
        });
      }
      const userPl = this.jwtService.verify(token) as UserType;
      console.log(userPl);
      return this.usersService.isUserInBase(userPl._id);
    } catch (e) {
      throw new UnauthorizedException({
        message: 'The user is not logged in',
      });
    }
  }
}
