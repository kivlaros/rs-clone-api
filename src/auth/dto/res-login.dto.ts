import { ApiProperty } from '@nestjs/swagger';

export class ResLoginUserDto {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty()
  readonly token: string;
}
