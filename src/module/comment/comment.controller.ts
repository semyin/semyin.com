import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  // 创建评论
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  // 查询所有评论
  @Get()
  async findAll() {
    return this.commentService.findAll();
  }

  // 查询单个评论
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.commentService.findOne(id);
  }

  // 更新评论
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  // 删除评论
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.commentService.remove(id);
  }

  // 查询目标的所有评论
  @Get('target/:targetId')
  async findByTarget(
    @Param('targetId') targetId: number,
    @Query('targetType') targetType: 'article' | 'brief' | 'comment',
  ) {
    return this.commentService.findByTarget(targetId, targetType);
  }
}
