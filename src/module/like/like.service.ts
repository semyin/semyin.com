import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  // 点赞
  async create(createLikeDto: CreateLikeDto): Promise<Like> {
    const { targetId, targetType, userId } = createLikeDto;

    // 检查是否已经点赞
    const existingLike = await this.likeRepository.findOne({
      where: { targetId, targetType, userId },
    });

    if (existingLike) {
      throw new ConflictException('您已经点赞过该目标');
    }

    // 创建点赞记录
    const like = this.likeRepository.create(createLikeDto);
    return this.likeRepository.save(like);
  }

  // 取消点赞
  async remove(createLikeDto: CreateLikeDto): Promise<void> {
    const { targetId, targetType, userId } = createLikeDto;

    // 查找点赞记录
    const like = await this.likeRepository.findOne({
      where: { targetId, targetType, userId },
    });

    if (!like) {
      throw new NotFoundException('未找到点赞记录');
    }

    // 删除点赞记录
    await this.likeRepository.remove(like);
  }

  // 检查是否已点赞
  async isLiked(createLikeDto: CreateLikeDto): Promise<boolean> {
    const { targetId, targetType, userId } = createLikeDto;

    const like = await this.likeRepository.findOne({
      where: { targetId, targetType, userId },
    });

    return !!like;
  }
}