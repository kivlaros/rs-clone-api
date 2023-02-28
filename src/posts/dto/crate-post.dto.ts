import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Headline field should not be empty' })
  @IsString({ message: 'Text should be string' })
  @Length(5, 50, {
    message: 'Headline length Must be between 6 and 50 charcters',
  })
  readonly headline: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Text field should not be empty' })
  @IsString({ message: 'Text should be string' })
  @Length(10, 10000, {
    message: 'Text length Must be between 10 and 10000 charcters',
  })
  readonly text: string;
}
