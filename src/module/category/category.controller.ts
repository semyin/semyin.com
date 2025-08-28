import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 查询所有分类
  @Get()
  async findAll(
    @Query("name") name: string | undefined
  ): Promise<Category[]> {
    return this.categoryService.findAll(name);
  }

  // 查询单个分类
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  // 创建分类
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body('name') name: string, @Body('description') description?: string, @Body('emoji') emoji?: string): Promise<Category> {
    return this.categoryService.create(name, description, emoji);
  }

  // 更新分类
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('description') description?: string,
    @Body('emoji') emoji?: string,
  ): Promise<Category> {
    return this.categoryService.update(id, name, description, emoji);
  }

  // 删除分类
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}