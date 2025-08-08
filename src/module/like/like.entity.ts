import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { format } from 'date-fns';
import { Transform } from 'class-transformer';

@Entity('like')
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ comment: '目标ID（文章ID或简讯ID）' })
  targetId!: number;

  @Column({ type: 'enum', enum: ['article', 'brief'], comment: '目标类型（文章或简讯）' })
  targetType!: 'article' | 'brief';

  @Column({ comment: '用户ID' })
  userId!: number;

  @CreateDateColumn()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  createdAt!: Date;
}
