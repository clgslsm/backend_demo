import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Match } from 'src/entities/match.entity';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { Like } from 'src/entities/like.entity';
@Injectable()
export class UserInteractService {
  private mg: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  async handleLike(
    userId: number,
    likedUserId: number,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findOne(userId);
    const likedUser = await this.usersService.findOne(likedUserId);

    if (!user || !likedUser) {
      throw new BadRequestException('User not found');
    }
    const alreadyLiked = await this.checkIfUserLikes(userId, likedUserId);
    if (alreadyLiked) {
      throw new BadRequestException('User already liked');
    }
    this.addLike(user.id, likedUser.id);
    const isMatch = await this.checkIfUserLikes(likedUserId, userId);
    if (isMatch) {
      const match = await this.insertMatch(user, likedUser);
      await this.sendMatchNotification(user.email, likedUser.email);
      await this.emailService.scheduleMonthlyReminder(
        user.email,
        likedUser.email,
        match.createdAt,
      );

      return { message: "It's a match! Both users have liked each other." };
    }

    return { message: 'User liked successfully.' };
  }

  private async sendMatchNotification(
    email1: string,
    email2: string,
  ): Promise<void> {
    console.log('sending match notification');
    await this.emailService.sendMatchNotification(email1, email2);
  }

  async insertMatch(user1: User, user2: User): Promise<Match> {
    const match = this.matchRepository.create({
      user1,
      user2,
    });

    return await this.matchRepository.save(match);
  }

  async addLike(userId: number, likedUserId: number): Promise<Like> {
    const user = await this.usersService.findOne(userId);
    const likedUser = await this.usersService.findOne(likedUserId);
    if (!user || !likedUser) {
      throw new Error('User not found');
    }
    // Check if the user like himself
    if (userId === likedUserId) {
      throw new Error('User cannot like himself');
    }
    const like = this.likeRepository.create({ user, likedUser });
    return await this.likeRepository.save(like);
  }

  async checkIfUserLikes(
    userId: number,
    likedUserId: number,
  ): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, likedUser: { id: likedUserId } },
    });
    return !!like;
  }
}
