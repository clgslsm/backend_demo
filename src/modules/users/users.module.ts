// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { UsersController } from './users.controller';
import { CaslModule } from 'src/utils/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CaslModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
