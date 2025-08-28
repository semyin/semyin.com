import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Category } from './category.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  // 创建分类
  async create(name: string, description?: string, emoji?: string): Promise<Category> {
    const category = await this.categoryRepository.create({ name, description, emoji });
    await this.categoryRepository.save(category);
    return plainToInstance(Category, category)
  }

  // 查询所有分类
  async findAll(
    name?: string
  ): Promise<Category[]> {
    const result = await this.categoryRepository.find({
      where: name ? {
        name: Like(`%${name}%`)
      }: {}
    });
    return plainToInstance(Category, result)
  }

  // 查询单个分类
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('分类不存在');
    }
    return plainToInstance(Category, category);
  }

  // 更新分类
  async update(id: number, name: string, description?: string, emoji?: string): Promise<Category> {
    const category = await this.findOne(id);
    category.name = name;
    if (description !== undefined) {
      category.description = description;
    }
    if (emoji !== undefined) {
      category.emoji = emoji;
    }
    await this.categoryRepository.save(category);
    return plainToInstance(Category, category);
  }

  // 删除分类
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}