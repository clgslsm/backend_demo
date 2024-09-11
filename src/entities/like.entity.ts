import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.givenLikes)
  user: User;

  @ManyToOne(() => User, (user) => user.receivedLikes)
  likedUser: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date; // Optional soft delete column
}
