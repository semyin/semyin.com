import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { plainToInstance } from 'class-transformer';
import { TagWithArticleCountDto } from './dto/tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }

  // 创建标签
  async create(name: string): Promise<Tag> {
    const tag = this.tagRepository.create({ name });
    return plainToInstance(Tag, this.tagRepository.save(tag))
  }

  // 查询所有标签
  async findAll(
    name?: string
  ): Promise<Tag[]> {
    const queryBuilder = this.tagRepository.createQueryBuilder("tag");

    if (name) {
      queryBuilder.where("tag.name LIKE :name", { name: `%${name}%` })
    }

    const result = await queryBuilder.getMany()
    return plainToInstance(Tag, result)
  }

  // 查询单个标签及其关联的文章
  async findOne(id: number): Promise<TagWithArticleCountDto> {
    const tag = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.articles', 'article') // 直接关联 Article 表
      .select([
        'tag.id',
        'tag.name',
        'tag.createdAt',
        'tag.updatedAt',
        'article.id',
        'article.title',
        'article.createdAt',
        'article.updatedAt',
      ])
      .loadRelationCountAndMap('tag.articleCount', 'tag.articles') // 计算关联文章的数量
      .where('tag.id = :id', { id })
      .getOne();

    if (!tag) {
      throw new NotFoundException('标签不存在');
    }

    return plainToInstance(TagWithArticleCountDto, tag);
  }

  // 更新标签
  async update(id: number, name: string): Promise<Tag> {
    const tag = await this.findOne(id);
    tag.name = name;
    return this.tagRepository.save(plainToInstance(Tag, tag));
  }

  // 删除标签
  async remove(id: number): Promise<void> {
    const tag = await this.tagRepository.findOneBy({ id })
    if (tag) {
      await this.tagRepository.remove(tag);
    }
  }
}