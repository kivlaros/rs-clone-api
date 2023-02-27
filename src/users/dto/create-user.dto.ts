import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Username field should not be empty' })
  @IsString({ message: 'Username should be string' })
  @Length(3, 15, {
    message: 'Username length Must be between 6 and 50 charcters',
  })
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name field should not be empty' })
  @IsString({ message: 'Name should be string' })
  @Length(5, 30, {
    message: 'Name length Must be between 6 and 50 charcters',
  })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password field should not be empty' })
  @IsString({ message: 'Password should be string' })
  @Length(3, 15, {
    message: 'Password length Must be between 6 and 50 charcters',
  })
  readonly password: string;
}
