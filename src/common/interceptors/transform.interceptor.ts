import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Response } from '../interfaces/response.interface';
import { NO_RESPONSE_WRAPPER } from '../decorators/no-response-wrapper.decorator';
import { RESPONSE_MESSAGE, RESPONSE_CODE } from '../decorators/set-response.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {

  constructor(private reflector: Reflector) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {

    const noWrapper = this.reflector.get<boolean>(
      NO_RESPONSE_WRAPPER,
      context.getHandler(),
    );

    if (noWrapper) {
      return next.handle(); // 直接返回原始数据
    }

    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ||
      'ok';
    const code =
      this.reflector.get<number>(RESPONSE_CODE, context.getHandler()) || 200;

    return next.handle().pipe(
      map((data) => ({
        code, // 默认成功状态码
        message, // 默认成功消息
        data, // 返回的数据
      })),
    );
  }
}