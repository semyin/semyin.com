export class CreateLikeDto {
  targetId!: number; // 目标ID
  targetType!: 'article' | 'brief'; // 目标类型
  userId!: number; // 用户ID
}