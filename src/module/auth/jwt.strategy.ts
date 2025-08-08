import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "@/common/interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.jwt,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("VITE_JWT_SECRET", "default_secret"), // 🔥 这里提供默认值
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    return { userId: payload.sub, username: payload.username };
  }
}
