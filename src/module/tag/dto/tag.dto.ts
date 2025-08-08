import { Expose, Type } from 'class-transformer';

export class TagWithArticleCountDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;

  @Expose()
  articleCount!: number;

  @Expose()
  @Type(() => ArticleDto)
  articles?: ArticleDto[];
}

export class ArticleDto {
  @Expose()
  id!: number;

  @Expose()
  title!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
