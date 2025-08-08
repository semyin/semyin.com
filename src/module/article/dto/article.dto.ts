import { Expose, Transform, Type } from "class-transformer";
import { format } from "date-fns";

export class ArticleMetaDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  property?: string;

  @Expose()
  content!: string;

  @Expose()
  isDefault!: boolean;

  @Expose()
  resourceType?: string;

  @Expose()
  resourceId?: number;

  @Expose()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  createdAt!: Date;

  @Expose()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss')) // 转换为本地时间字符串
  updatedAt!: Date;
}

export class ArticleListDto {

  @Expose()
  id!: number;

  @Expose()
  title!: string;

  @Expose()
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd HH:mm:ss")) // 转换为本地时间字符串
  createdAt!: Date;

  @Expose()
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd HH:mm:ss")) // 转换为本地时间字符串
  updatedAt!: Date;
}

export class TagDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd HH:mm:ss")) // 转换为本地时间字符串
  createdAt!: Date;

  @Expose()
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd HH:mm:ss")) // 转换为本地时间字符串
  updatedAt!: Date;
}

export class ArticleDto {
  @Expose()
  id!: number;

  @Expose()
  title!: string;

  @Expose()
  content!: string;

  @Expose()
  type!: string;

  @Expose()
  @Type(() => TagDto)
  tags?: TagDto[];

  @Expose()
  @Type(() => ArticleMetaDto)
  metas!: ArticleMetaDto[];

  @Expose()
  summary?: string;

  @Expose()
  authorId!: number;

  @Expose()
  categoryId?: number;

  @Expose()
  @Transform(({ obj }) => obj.category?.name || null) 
  categoryName?: string;

  @Expose()
  coverImage?: string;

  @Expose()
  @Transform(({ value }) => Boolean(value))
  isPublished?: boolean;

  @Expose()
  @Transform(({ value }) => Boolean(value))
  isTop?: boolean;

  @Expose()
  viewCount?: number;

  @Expose()
  likeCount?: number;

  @Expose()
  commentCount?: number;

  @Expose()
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd HH:mm:ss")) // 转换为本地时间字符串
  createdAt!: Date;

  @Expose()
  @Transform(({ value }) => format(new Date(value), "yyyy-MM-dd HH:mm:ss")) // 转换为本地时间字符串
  updatedAt!: Date;
}
