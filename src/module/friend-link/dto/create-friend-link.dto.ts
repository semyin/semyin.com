export class CreateFriendLinkDto {
  name!: string;
  url!: string;
  description?: string;
  avatarUrl?: string;
  type?: string;
  sortWeight?: number;
  isVisible?: boolean;
}
