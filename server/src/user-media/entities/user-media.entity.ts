import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/user/entities/user.entity';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CrawlType {
  KEYWORD = 'keyword',
  URL = 'url',
}

@Entity({ name: 'UserMedia' })
export class UserMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, (user) => user.user_media)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Media, (media) => media.user_media)
  media: Media[];

  @Column({ type: 'varchar' })
  crawl_string: string;

  @Column({
    type: 'enum',
    enum: CrawlType,
  })
  crawl_type: CrawlType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
