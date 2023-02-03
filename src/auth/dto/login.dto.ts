import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ uniqueItems: true })
  readonly username: string;
  @ApiProperty()
  readonly password: string;
}
