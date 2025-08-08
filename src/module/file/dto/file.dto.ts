import { Expose, Transform } from "class-transformer";
import { format } from "date-fns";

export class FileDto {

  @Expose()
  id!: number;

  @Expose()
  filename!: string;

  @Expose()
  originalname!: string;

  @Expose()
  mimetype!: string;

  @Expose()
  size!: number;

  @Expose()
  type!: string;

  @Expose()
  url!: string;

  @Expose()
  cosKey!: string;

  @Expose()
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd HH:mm:ss")) // 转换为本地时间字符串
  createdAt!: Date;

  @Expose()
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd HH:mm:ss")) // 转换为本地时间字符串
  updatedAt!: Date;
}