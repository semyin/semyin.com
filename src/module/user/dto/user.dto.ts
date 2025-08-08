import { Exclude, Expose, Transform } from "class-transformer";
import { format } from "date-fns";

export class UserPayload {
  username!: string;
  email!: string;
  password!: string;
  avatarUrl?: string;
  pushType?: string;
  pushUrl?: string;
  phone?: string;
}

export class UserDto {
  @Expose()
  id!: number;

  @Expose()
  username!: string;

  @Exclude()
  passwordHash!: string;

  @Expose()
  email!: string;

  @Expose()
  avatarUrl?: string;

  @Expose()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'))
  createdAt!: Date;

  @Expose()
  @Transform(({ value }) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'))
  updatedAt!: Date;

  @Expose()
  pushType?: string;

  @Expose()
  pushUrl?: string;

  @Expose()
  phone!: string;
}