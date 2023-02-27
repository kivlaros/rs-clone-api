import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Headline field should not be empty' })
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Headline field should not be empty' })
  readonly password: string;
}
