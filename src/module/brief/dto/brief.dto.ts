export class CreateBriefDto {
    content!: string; // 简讯内容
    authorId!: number; // 作者ID
    isPublished?: boolean; // 是否发布（可选）
  }

  export class UpdateBriefDto {
    content?: string; // 简讯内容（可选）
    isPublished?: boolean; // 是否发布（可选）
  }