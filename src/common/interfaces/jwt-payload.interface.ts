interface IJwtPayload {
  userId: number;
  username: string;
}

type JwtPayload = IJwtPayload

export type { JwtPayload };