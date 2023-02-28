import { ApiProperty } from '@nestjs/swagger';

export class CreateRespChatDto {
  @ApiProperty()
  readonly message: string;
  @ApiProperty()
  readonly user: string;
  @ApiProperty()
  readonly target: string;
  @ApiProperty()
  readonly chat: string;
}
