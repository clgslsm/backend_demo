// src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../shared/roles.enum';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
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
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  // Get details of user when admin or user himself
  async getUserDetails(id: number, currentUser: User): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.id !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Access to this resource is forbidden');
    }
    return user;
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
    currentUser: User,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.id !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Access to this resource is forbidden');
    }

    Object.assign(user, updates);
    return this.userRepository.save(user);
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
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

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

  async deleteUser(id: number, requestingUser: User): Promise<void> {
    const user = await this.findOne(id);

    if (requestingUser.role !== Role.ADMIN && requestingUser.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this user',
      );
    }

    await this.userRepository.softRemove(user);
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
}
