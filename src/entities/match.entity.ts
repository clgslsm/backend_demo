import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { ChatTheme } from './chatTheme.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user1: User;

  @ManyToOne(() => User)
  user2: User;

  @Column({ nullable: true })
  chatId?: string;

  @Column({ nullable: true })
  photoLink?: string;

  @OneToOne(() => ChatTheme, (chatTheme) => chatTheme.match)
  chatTheme: ChatTheme; // The associated chat theme for this match

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
