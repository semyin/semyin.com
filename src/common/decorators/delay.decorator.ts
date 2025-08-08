import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * 延迟拦截器
 */
@Injectable()
export class DelayInterceptor implements NestInterceptor {
  constructor(private readonly delayTime: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(delay(this.delayTime)); // 延迟返回数据
  }
}

/**
 * 延迟装饰器
 * @param ms 延迟时间（毫秒）
 */
export function DelayResponse(ms: number) {
  return applyDecorators(UseInterceptors(new DelayInterceptor(ms)));
}
