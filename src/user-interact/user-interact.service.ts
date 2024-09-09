import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Match } from 'src/entities/match.entity';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserInteractService {
  private mg: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async handleLike(userId: number, likedUserId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likes'],
    });

    const likedUser = await this.userRepository.findOne({
      where: { id: likedUserId },
      relations: ['likes'],
    });

    if (!user || !likedUser) {
      throw new BadRequestException('User not found');
    }

    const alreadyLiked = user.likes.some((liked) => liked.id === likedUserId);

    if (alreadyLiked) {
      throw new BadRequestException('User already liked');
    }

    const isMatch = likedUser.likes.some((liked) => liked.id === userId);
    if (isMatch) {
      const match = await this.insertMatch(user, likedUser);
      await this.sendMatchNotification(user.email, likedUser.email);
      await this.emailService.scheduleMonthlyReminder(
        user.email,
        likedUser.email,
        match.createdAt,
      );
    }

    user.likes.push(likedUser);
    await this.userRepository.save(user);
  }

  private async sendMatchNotification(
    email1: string,
    email2: string,
  ): Promise<void> {
    console.log('sending match notification');
    await this.emailService.sendMatchNotification(email1, email2);
  }

  async insertMatch(user1: User, user2: User): Promise<Match> {
    const match = new Match();
    match.user1 = user1;
    match.user2 = user2;
    match.createdAt = new Date();
    return await this.matchRepository.save(match);
  }
}
