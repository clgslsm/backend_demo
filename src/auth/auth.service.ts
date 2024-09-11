// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { Role } from 'src/shared/roles.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async loginWithCredentials(logInDto: LoginDto) {
    const { username, password } = logInDto;
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }

  async signUp(signUpDto: SignUpDto) {
    const createUserDto: CreateUserDto = {
      ...signUpDto,
      role: Role.USER,
    };
    return this.usersService.createUser(createUserDto);
  }

  async login(user: Omit<User, 'password'>) {
    const payload: JwtPayload = {
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
