import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brief } from './brief.entity';
import { CreateBriefDto, UpdateBriefDto } from './dto/brief.dto';

@Injectable()
export class BriefService {
  constructor(
    @InjectRepository(Brief)
    private readonly briefRepository: Repository<Brief>,
  ) {}

  // 创建简讯
  async create(createBriefDto: CreateBriefDto): Promise<Brief> {
    const brief = this.briefRepository.create(createBriefDto);
    return this.briefRepository.save(brief);
  }

  // 查询所有简讯
  async findAll(): Promise<Brief[]> {
    return this.briefRepository.find();
  }

  // 查询单个简讯
  async findOne(id: number): Promise<Brief | null> {
    return this.briefRepository.findOne({ where: { id } });
  }

  // 更新简讯
  async update(id: number, updateBriefDto: UpdateBriefDto): Promise<Brief | null> {
    await this.briefRepository.update(id, updateBriefDto);
    return this.briefRepository.findOne({ where: { id } });
  }

  // 删除简讯
  async remove(id: number): Promise<void> {
    await this.briefRepository.delete(id);
  }

  // 增加浏览量
  async incrementViewCount(id: number): Promise<void> {
    await this.briefRepository.increment({ id }, 'viewCount', 1);
  }

  // 增加点赞数
  async incrementLikeCount(id: number): Promise<void> {
    await this.briefRepository.increment({ id }, 'likeCount', 1);
  }

  // 增加评论数
  async incrementCommentCount(id: number): Promise<void> {
    await this.briefRepository.increment({ id }, 'commentCount', 1);
  }
}