import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
  Req,
  ParseBoolPipe,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { Article } from "./article.entity";
import { ArticleDto, ArticleListDto } from "./dto/article.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { User } from "@/common/decorators/user.decorator";
import { ParseOptionalBoolPipe } from "@/common/pipe/parse-optional-bool.pipe";
import { Pagination } from "@/interface/pagination.interface";
import { ParseOptionalArrayPipe } from "@/common/pipe/parse-optional-array.pipe";
import type { JwtPayload } from "@/common/interfaces/jwt-payload.interface";
import { completeTimeFromDateRange } from "@/common/utils";

@Controller()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Get()
  findList(): Promise<ArticleListDto[]> {
    return this.articleService.findList();
  }

  @Get("about")
  getAboutPage(): Promise<ArticleDto> {
    return this.articleService.getAboutPage();
  }

  @Get("/manage")
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Query("withTags", new DefaultValuePipe(false), ParseBoolPipe) withTags: boolean = false,
    @Query("withMetas", new DefaultValuePipe(false), ParseBoolPipe) withMetas: boolean = false,
    @Query("title") title: string | undefined,
    @Query("isPublished", ParseOptionalBoolPipe) isPublished?: boolean,
    @Query("isTop", ParseOptionalBoolPipe) isTop?: boolean,
    @Query("tagIds", ParseOptionalArrayPipe) tagIds?: number[],
    @Query("categoryIds", ParseOptionalArrayPipe) categoryIds?: number[],
    @Query("dates", ParseOptionalArrayPipe) dates?: string[]
  ): Promise<Pagination<ArticleDto>> {
    const dateRange = completeTimeFromDateRange(dates)
    return this.articleService.findAll(
      { page, limit },
      title,
      isPublished,
      isTop,
      tagIds,
      categoryIds,
      withTags,
      withMetas,
      dateRange
    );
  }

  @Post("/manage")
  @UseGuards(JwtAuthGuard)
  create(
    @Body() body: Partial<Article> & { tagIds?: number[] },
    @User() user: JwtPayload
  ): Promise<Article> {
    const { tagIds = [], ...others } = body;
    return this.articleService.create(others, user.userId, tagIds);
  }

  @Get("/manage/:id")
  @UseGuards(JwtAuthGuard)
  getOne(@Param("id") id: number): Promise<ArticleDto> {
    return this.articleService.findOne(id);
  }

  @Put("/manage/:id")
  @UseGuards(JwtAuthGuard)
  update(
    @Param("id") id: string,
    @Body() body: Partial<Article> & { tagIds?: number[] },
  ): Promise<Article> {
    const { tagIds = [], ...others } = body;
    return this.articleService.update(+id, others, tagIds);
  }

  @Delete("/manage/:id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string): Promise<void> {
    return this.articleService.remove(+id);
  }

  // 发布文章
  @Patch("/manage/:id/publish")
  @UseGuards(JwtAuthGuard)
  async publishArticle(@Param("id") id: number, @Body("isPublished") isPublished: boolean): Promise<null> {
    await this.articleService.updateStatus(id, "isPublished", isPublished);
    return null;
  }

  // 置顶文章
  @Patch("/manage/:id/top")
  @UseGuards(JwtAuthGuard)
  async topArticle(@Param("id") id: number, @Body("isTop") isTop: boolean): Promise<null> {
    await this.articleService.updateStatus(id, "isTop", isTop);
    return null;
  }

  @Get(":id")
  findOne(@Param("id") id: number): Promise<ArticleDto> {
    return this.articleService.findOne(id);
  }

  @Patch("/manage/about")
  updateAboutPage(@Body() article: Partial<Article>): Promise<ArticleDto> {
    return this.articleService.updateAboutPage(article);
  }

  @Get("privacy")
  findPrivacyPage(): Promise<ArticleDto> {
    return this.articleService.findPrivacyPage();
  }

  @Patch(":id/view")
  incrementViewCount(@Param("id") id: string): Promise<void> {
    return this.articleService.incrementViewCount(+id);
  }

  @Patch(":id/like")
  incrementLikeCount(@Param("id") id: string): Promise<void> {
    return this.articleService.incrementLikeCount(+id);
  }

  @Patch(":id/comment")
  incrementCommentCount(@Param("id") id: string): Promise<void> {
    return this.articleService.incrementCommentCount(+id);
  }
}
