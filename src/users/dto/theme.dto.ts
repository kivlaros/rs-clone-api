import { ApiProperty } from '@nestjs/swagger';

export class ThemeDto {
  @ApiProperty()
  readonly link: string;
}
