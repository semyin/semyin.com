import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Article } from '../article/article.entity';
import { Transform } from 'class-transformer';
import { format } from 'date-fns';

@Entity()
export class Meta {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, nullable: true })
  name?: string;

  @Column({ length: 255, nullable: true })
  property?: string;

  @Column('text')
  content!: string;

  @Column({ default: false })
  @Transform(({ value }) => Boolean(value))
  isDefault!: boolean;

  @Column({ type: "varchar", length: 50, nullable: true })
  resourceType!: string | null;

  @Column({ type: "int", nullable: true })
  resourceId!: number | null;

  @CreateDateColumn()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  createdAt!: Date;

  @UpdateDateColumn()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  updatedAt!: Date;

  @ManyToOne(() => Article, (article) => article.metas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resource_id' })
  resource!: Relation<Article>;
}
