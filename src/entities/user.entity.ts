import { Role } from 'src/shared/roles.enum';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Like } from './like.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  email: string;

  @OneToMany(() => Like, (like) => like.user)
  givenLikes: Like[];

  @OneToMany(() => Like, (like) => like.likedUser)
  receivedLikes: Like[];

  @DeleteDateColumn()
  deletedAt?: Date;
  private _id: any;
}
