import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm'
import { Transform } from 'class-transformer';
import { format } from 'date-fns';
import { Meta } from '../meta/meta.entity';
import { BlogJourneyItem, ContactMethod } from './dto/about.dto';

@Entity('about')
export class About {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column('text')
  content!: string;

  @Column({ length: 500, nullable: true })
  summary?: string;

  @Column({ name: 'author_id' })
  authorId!: number;

  @Column({ name: 'cover_image', length: 255, nullable: true })
  coverImage?: string;

  @Column({ name: "is_published", type: "tinyint", default: 0 })
  @Transform(({ value }) => Boolean(value))
  isPublished?: boolean;

  @Column({ name: 'view_count', default: 0 })
  viewCount?: number;

  @Column({ type: 'json', nullable: true })
  contactMethods?: Array<ContactMethod>;

  @Column({ type: 'json', nullable: true })
  blogJourney?: Array<BlogJourneyItem>;

  @CreateDateColumn({ name: 'created_at' })
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'))
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'))
  updatedAt!: Date;

  @OneToMany(() => Meta, (meta) => meta.resource)
  metas?: Relation<Meta[]>;
}