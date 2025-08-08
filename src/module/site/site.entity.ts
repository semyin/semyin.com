import { Transform } from 'class-transformer';
import { format } from 'date-fns';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('site')
export class Site {
  @PrimaryGeneratedColumn()
  id!: number; // 主键ID，固定为1

  @Column({ name: 'name', length: 255 })
  name!: string; // 站点名称

  @Column({ name: 'url', length: 255 })
  url!: string; // 站点链接

  @Column({ type: 'text', nullable: true })
  description!: string; // 站点介绍

  @Column({ length: 255, nullable: true })
  copyright!: string; // 版权信息

  @Column({ length: 255, nullable: true })
  icp!: string; // 备案号

  @Column({ name: 'run_time', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  runTime!: Date; // 运行时间
}
