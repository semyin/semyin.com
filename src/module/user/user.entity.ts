import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, comment: '用户名' })
  username!: string;

  @Column({ unique: true, comment: '邮箱' })
  email!: string;

  @Column({ name: 'password_hash', comment: '密码哈希' })
  passwordHash!: string;

  @Column({ name: 'avatar_url', nullable: true, comment: '头像URL' })
  avatarUrl?: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt!: Date;

  @Column({ name: 'push_type', nullable: true, comment: '推送类型' })
  pushType?: string;

  @Column({ name: 'push_url', nullable: true, comment: '推送URL' })
  pushUrl?: string;

  @Column({ nullable: true, comment: '电话号码' })
  phone!: string;
}
