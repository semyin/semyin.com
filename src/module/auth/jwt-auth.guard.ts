import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { parseBoolean } from "@/common/utils";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  
  constructor(
    private configService: ConfigService
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {

    // 从环境变量中获取是否启用认证的配置
    const isAuthDisabled = this.configService.get<boolean>('VITE_JWT_AUTH_DISABLE', false);
    
    
    // 如果认证被禁用，则直接返回 true，允许所有请求通过
    if (parseBoolean(isAuthDisabled)) {
      return true;
    }
    
    // 否则，执行标准的 JWT 认证
    return super.canActivate(context);
  }
}
