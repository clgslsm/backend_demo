// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Detail } from '../entities/detail.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['detail'],
    });
  }

  async findDetailForUser(userId: number): Promise<Detail> {
    const detail = await this.detailRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!detail) {
      throw new NotFoundException('Detail not found');
    }
    return detail;
  }

  async findAllDetails(): Promise<Detail[]> {
    return this.detailRepository.find({ relations: ['user'] });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(newUser);
  }
}
