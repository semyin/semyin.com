import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import {
  Pagination,
  PaginationOptions,
} from "@/interface/pagination.interface";

export function createPagination<T>(
  items: T[],
  total: number,
  options: PaginationOptions
): Pagination<T> {
  const page = options.page || 1;
  const limit = options.limit || 10;

  return {
    items,
    meta: {
      totalItems: total,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    },
  };
}

export async function paginateQuery<T extends ObjectLiteral, R = T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginationOptions,
  transform?: (items: T[]) => R[]
): Promise<Pagination<R>> {
  // 验证和规范化分页参数
  const page = Math.max(1, Math.floor(options.page || 1));
  const limit = Math.max(1, Math.floor(options.limit || 10));

  try {
    const [items, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    // 如果没有提供 transform 函数，直接使用原始数据
    const transformedItems = transform
      ? transform(items)
      : (items as unknown as R[]);

    return createPagination(transformedItems, total, { page, limit });
  } catch (error: any) {
    // 可以根据需求处理错误
    throw new Error(`Pagination query failed: ${error.message}`);
  }
}
