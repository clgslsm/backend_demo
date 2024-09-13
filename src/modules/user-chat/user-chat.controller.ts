// user-chat.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserChatService } from './user-chat.service';
import { UpdateChatThemeDto } from './dto/updateChatTheme.dto';
import { ChatTheme } from 'src/entities/chatTheme.entity';

@Controller('user-chat')
export class UserChatController {
  constructor(private readonly userChatService: UserChatService) {}
  @Post(':matchId/chat-theme')
  async createChatThemeByMatchId(
    @Param('matchId') matchId: number,
  ): Promise<ChatTheme> {
    return this.userChatService.createChatThemeByMatchId(matchId);
  }

  @Put(':matchId/chat-theme')
  async updateChatTheme(
    @Param('matchId') matchId: number,
    @Body() updateChatThemeDto: UpdateChatThemeDto,
  ): Promise<ChatTheme> {
    return this.userChatService.updateChatThemeByMatchId(
      matchId,
      updateChatThemeDto,
    );
  }

  @Get(':matchId/chat-theme')
  async getChatThemeByMatchId(
    @Param('matchId') matchId: number,
  ): Promise<ChatTheme> {
    return this.userChatService.getChatThemeByMatchId(matchId);
  }

  @Delete(':matchId/chat-theme')
  async deleteChatThemeByMatchId(
    @Param('matchId') matchId: number,
  ): Promise<void> {
    return this.userChatService.deleteChatThemeByMatchId(matchId);
  }
}
