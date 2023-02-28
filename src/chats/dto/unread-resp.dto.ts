import { ApiProperty } from '@nestjs/swagger';

export class UnreadRespDto {
  @ApiProperty()
  readonly unread: number;
}
