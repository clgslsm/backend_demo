// user-chat.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatTheme } from 'src/entities/chatTheme.entity';
import { Match } from 'src/entities/match.entity';
import { UpdateChatThemeDto } from './dto/updateChatTheme.dto';
@Injectable()
export class UserChatService {
  constructor(
    @InjectRepository(ChatTheme)
    private readonly chatThemeRepository: Repository<ChatTheme>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async createChatThemeByMatchId(matchId: number): Promise<ChatTheme> {
    const chatTheme = await this.chatThemeRepository.create({
      match: { id: matchId },
      backgroundTheme: 'lover',
      font: 'lover',
      likeIcon: 'lover',
    });
    return this.chatThemeRepository.save(chatTheme);
  }

  async getChatThemeByMatchId(matchId: number): Promise<ChatTheme> {
    const chatTheme = await this.chatThemeRepository.findOne({
      where: { match: { id: matchId } },
    });
    if (!chatTheme) {
      throw new NotFoundException('Chat theme not found');
    }
    return chatTheme;
  }

  async updateChatThemeByMatchId(
    matchId: number,
    updateChatThemeDto: UpdateChatThemeDto,
  ): Promise<ChatTheme> {
    const chatTheme = await this.chatThemeRepository.findOne({
      where: { match: { id: matchId } },
    });
    if (!chatTheme) {
      throw new NotFoundException('Chat theme not found');
    }
    Object.assign(chatTheme, updateChatThemeDto);
    return this.chatThemeRepository.save(chatTheme);
  }

  async deleteChatThemeByMatchId(matchId: number): Promise<void> {
    await this.chatThemeRepository.softDelete({ match: { id: matchId } });
  }
}
