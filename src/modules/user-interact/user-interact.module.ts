import { Module } from '@nestjs/common';
import { UserInteractService } from './user-interact.service';
import { UserInteractController } from './user-interact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Match } from 'src/entities/match.entity';
import { EmailModule } from 'src/utils/email/email.module';
import { UsersModule } from 'src/modules/users/users.module';
import { Like } from 'src/entities/like.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Match, Like]),
    EmailModule,
    UsersModule,
  ],
  providers: [UserInteractService],
  controllers: [UserInteractController],
})
export class UserInteractModule {}
