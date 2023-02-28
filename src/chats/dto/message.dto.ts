import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty()
  readonly text: string;
}
