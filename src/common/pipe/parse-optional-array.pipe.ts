import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseOptionalArrayPipe implements PipeTransform<string | string[], number[] | string[] | undefined> {
  transform(value: string | string[]): number[] | string[] | undefined {
    if (!value) {
      return undefined;
    }

    try {
      let array: string[];

      // 如果输入是字符串
      if (typeof value === 'string') {
        // 如果输入是 [1,2,3] 格式，去掉方括号
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1);
        }
        array = value.split(',');
      } else {
        // 如果输入是数组（string[]），直接使用
        array = value;
      }

      // 尝试将数组中的每个元素转换为数字
      const parsedAsNumbers = array.map(item => {
        const parsed = Number(item);
        if (isNaN(parsed)) {
          return null; // 如果无法转换为数字，返回 null
        }
        return parsed;
      });

      // 如果所有元素都能转换为数字，返回 number[]
      if (parsedAsNumbers.every(item => item !== null)) {
        return parsedAsNumbers as number[];
      }

      // 否则，返回 string[]
      return array;
    } catch (error) {
      throw new BadRequestException('Invalid array format');
    }
  }
}
