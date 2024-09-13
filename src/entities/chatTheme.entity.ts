import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Match } from './match.entity';

@Entity()
export class ChatTheme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  backgroundTheme: string;

  @Column({ nullable: true })
  font: string;

  @Column({ nullable: true })
  likeIcon: string;

  @OneToOne(() => Match, (match) => match.chatTheme, { onDelete: 'CASCADE' })
  @JoinColumn()
  match: Match;

  @DeleteDateColumn()
  deletedAt: Date;
}
