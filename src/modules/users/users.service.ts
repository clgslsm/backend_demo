// src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Action, Role } from '../../shared/roles.enum';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import {
  Article,
  CaslAbilityFactory,
  UserDTO,
} from '../../utils/casl/casl-ability.factory';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {
    AWS.config.update({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserDetails(id: number, user: User): Promise<User> {
    const userProfile = new UserDTO();
    userProfile.id = id;
    const userDetails = await this.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(user);
    if (ability.can(Action.Read, userProfile)) {
      return userDetails;
    }
    throw new ForbiddenException('Access to this resource is forbidden');
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role, nickname, age, avatar } = createUserDto;
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new ForbiddenException('Username is already taken');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
      nickname,
      age,
      avatar,
    });

    return this.userRepository.save(newUser);
  }

  async updateUserDetails(
    id: number,
    updates: UpdateUserDto,
    user: User,
  ): Promise<User> {
    const userProfile = new UserDTO();
    userProfile.id = id;
    const userDetails = await this.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(user);
    if (ability.can(Action.Update, userProfile)) {
      Object.assign(userDetails, updates);
      return this.userRepository.save(userDetails);
    }
    throw new ForbiddenException('Access to this resource is forbidden');
  }

  // Test the connection to AWS S3
  async testS3Connection() {
    const s3 = new AWS.S3();
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const params = { Bucket: bucketName };
    const data = await s3.listObjectsV2(params).promise();
    console.log('Success', data.Contents);
  }

  async updateUserAvatar(
    id: number,
    file: Express.Multer.File,
    currentUser: User,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (user.id !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Access to this resource is forbidden');
    }

    const s3 = new AWS.S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
        Key: `avatars/${user.id}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();

    user.avatar = uploadResult.Location;
    return this.userRepository.save(user);
  }

  async deleteUser(
    id: number,
    requestingUser: User,
  ): Promise<{ message: string }> {
    const user = await this.findOne(id);
    const userProfile = new UserDTO();
    userProfile.id = id;
    const ability = this.caslAbilityFactory.createForUser(requestingUser);
    if (ability.can(Action.Delete, userProfile)) {
      await this.userRepository.softRemove(user);
      return { message: 'User deleted successfully' };
    }

    if (ability.cannot(Action.Delete, userProfile)) {
      throw new ForbiddenException(
        'You do not have permission to delete this user',
      );
    }
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username, deletedAt: null },
    });
  }

  async testCasl() {
    // Create a new Article
    const article = new Article();
    article.id = 1;
    article.title = 'Test Article';
    article.content = 'This is a test article';
    return article;
  }
}
