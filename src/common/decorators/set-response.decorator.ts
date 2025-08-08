import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE = 'response_message';
export const RESPONSE_CODE = 'response_code';

export const SetResponse = (code: number, message: string) => {
  return (target: any, key?: string, descriptor: PropertyDescriptor = {}) => {
    const metadataKey = key || ''; // 如果 key 是 undefined，使用空字符串
    SetMetadata(RESPONSE_MESSAGE, message)(target, metadataKey, descriptor); // 设置消息元数据
    SetMetadata(RESPONSE_CODE, code)(target, metadataKey, descriptor); // 设置状态码元数据
  };
};