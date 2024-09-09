import { Role } from 'src/shared/roles.enum';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @DeleteDateColumn()
  deletedAt?: Date;

  // Use ManyToMany relationship with likes
  @ManyToMany(() => User)
  @JoinTable()
  likes: User[];
}
