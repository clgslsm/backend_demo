// updateChatThemeDto
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateChatThemeDto {
  @ApiProperty({
    description: 'The background theme of the chat',
    example: 'red',
  })
  @IsString()
  backgroundTheme: string;

  @ApiProperty({
    description: 'The font of the chat',
    example: 'Arial',
  })
  @IsString()
  font: string;

  @ApiProperty({
    description: 'The like icon of the chat',
    example: 'like.png',
  })
  @IsString()
  likeIcon: string;
}
