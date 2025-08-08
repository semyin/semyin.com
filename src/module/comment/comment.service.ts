import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) { }

  // 创建评论
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(comment);
  }

  // 查询所有评论
  async findAll(): Promise<Comment[]> {
    const comments = await this.commentRepository.find({
      relations: ['user', 'children'], // 加载用户和子评论
    });
    const result = plainToInstance(Comment, comments);
    return this.buildCommentTree(result); // 手动构建树形结构
  }

  // 查询单个评论
  async findOne(id: number): Promise<Comment | null> {
    const comment = this.commentRepository.findOne({ where: { id } });
    return plainToInstance(Comment, comment);
  }

  // 更新评论
  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment | null> {
    await this.commentRepository.update(id, updateCommentDto);
    return this.commentRepository.findOne({ where: { id } });
  }

  // 删除评论
  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }

  // 查询目标的所有评论
  async findByTarget(targetId: number, targetType: 'article' | 'brief' | 'comment'): Promise<Comment[]> {
    // 使用递归 CTE 查询所有评论及其关联的 user
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user') // 加载 user
      .where('comment.targetId = :targetId', { targetId })
      .andWhere('comment.targetType = :targetType', { targetType })
      .getMany();

    // 构建树形结构
    const buildTree = (parentCommentId: number | null): Comment[] => {
      return comments
        .filter(comment => comment.parentCommentId === parentCommentId)
        .map(comment => {
          comment.children = buildTree(comment.id); // 递归构建子评论
          return plainToInstance(Comment, comment);
        });
    };

    return buildTree(null); // 从根评论开始构建
  }

  // 构建树形结构
  private buildCommentTree(comments: Comment[]): Comment[] {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // 将所有评论存入 Map
    comments.forEach(comment => {
      commentMap.set(comment.id, comment);
    });

    // 构建树形结构
    comments.forEach(comment => {
      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }
}
