import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ParseOptionalBoolPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined) {
      return undefined;
    }

    // 处理字符串的 'true' 和 'false'
    if (value === "true") return true;
    if (value === "false") return false;

    // 处理实际的布尔值
    if (value === true || value === false) return value;

    // 如果不是有效的布尔值表示，返回 undefined
    return undefined;
  }
}
