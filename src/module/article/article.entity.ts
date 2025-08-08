import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm'
import { Transform } from 'class-transformer';
import { format } from 'date-fns';
import { Meta } from '../meta/meta.entity';
import { Tag } from '../tag/tag.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column('text')
  content!: string;

  @Column({ length: 50, default: 'article' }) // 新增 type 字段
  type!: string; // 'article' 表示普通文章，'about' 表示关于页面，'privacy' 表示隐私政策

  @ManyToMany(() => Tag)
  @JoinTable({ name: "article_tag" })
  tags?: Relation<Tag>[];

  @Column({ length: 500, nullable: true })
  summary?: string;

  @Column()
  authorId!: number;

  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn({ name: 'categoryId' })
  category?: Relation<Category>;

  @Column({ length: 255, nullable: true })
  coverImage?: string;

  @Column({ name: "is_published", type: "tinyint", default: 0 })
  @Transform(({ value }) => Boolean(value))
  isPublished?: boolean;

  @Column({ default: false })
  @Transform(({ value }) => Boolean(value))
  isTop?: boolean;

  @Column({ default: 0 })
  viewCount?: number;

  @Column({ default: 0 })
  likeCount?: number;

  @Column({ default: 0 })
  commentCount?: number;

  @CreateDateColumn()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  createdAt!: Date;

  @UpdateDateColumn()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  updatedAt!: Date;

  @OneToMany(() => Meta, (meta) => meta.resource)
  metas?: Relation<Meta[]>;
}
