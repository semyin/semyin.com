import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { format } from 'date-fns';

@Entity('brief')
export class Brief {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', comment: '简讯内容' })
  content!: string;

  @Column({ name: 'author_id', comment: '作者ID' })
  authorId!: number;

  @Column({ name: 'is_published', default: false, comment: '是否发布' })
  isPublished!: boolean;

  @Column({ name: 'view_count', default: 0, comment: '浏览量' })
  viewCount?: number;

  @Column({ name: 'like_count', default: 0, comment: '点赞数' })
  likeCount?: number;

  @Column({ name: 'comment_count', default: 0, comment: '评论数' })
  commentCount?: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  updatedAt!: Date;
}
