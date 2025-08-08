import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import type { Relation } from 'typeorm'
import { Transform } from 'class-transformer';
import { format } from 'date-fns';
import { Article } from '../article/article.entity';

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @ManyToMany(() => Article, (article) => article.tags)
  @JoinTable({ name: "article_tag" })
  articles?: Relation<Article>[];

  @CreateDateColumn()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  createdAt!: Date;

  @UpdateDateColumn()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  updatedAt!: Date;
}
