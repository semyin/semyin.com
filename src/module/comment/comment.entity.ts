import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm'
import { Expose, Transform } from 'class-transformer';
import { format } from 'date-fns';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'target_id', comment: '目标ID（文章ID或简讯ID或评论ID）' })
  targetId!: number;

  @Column({ type: 'enum', enum: ['article', 'brief'], comment: '目标类型（文章或简讯）' })
  targetType!: 'article' | 'brief' | 'comment';

  @Column({ name: 'user_id', comment: '用户ID' })
  userId!: number;

  @Column({ type: 'text', comment: '评论内容' })
  content!: string;

  @Column({ name: 'parent_comment_id', nullable: true, comment: '父评论ID' })
  parentCommentId!: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  updatedAt!: Date;

  // 子评论
  @OneToMany(() => Comment, (comment) => comment.parent)
  @Transform(({ value }) => {
    if (value) {
      return value.map((comment: Comment) => ({
        ...comment,
      }));
    }
    return [];
  })
  @Expose()
  children?: Relation<Comment>[];

  // 父评论
  @ManyToOne(() => Comment, (comment) => comment.children)
  @JoinColumn({ name: 'parent_comment_id' })
  parent?: Relation<Comment>;
}
