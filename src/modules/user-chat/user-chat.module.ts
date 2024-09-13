// user-chat.module.ts
import { Module } from '@nestjs/common';
import { UserChatService } from './user-chat.service';
import { UserChatController } from './user-chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatTheme } from 'src/entities/chatTheme.entity';
import { Match } from 'src/entities/match.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ChatTheme, Match])],
  providers: [UserChatService],
  controllers: [UserChatController],
})
export class UserChatModule {}
