import { Logger } from '@nestjs/common';

export function WithLogger(context: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      logger: Logger = new Logger(context); // 显式声明 logger 属性
    };
  };
}
