import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meta } from './meta.entity';
import { plainToInstance } from 'class-transformer';
import { BaseService } from '@/common/service/base.service';
import { Pagination, PaginationOptions } from '@/interface/pagination.interface';
import { createPagination } from '@/common/utils/pagination';

@Injectable()
export class MetaService extends BaseService implements OnModuleInit {
  private metaCache: Meta[] = []; // 内存中的 Meta 缓存

  constructor(
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
  ) {
    super(MetaService.name)
  }

  // 项目启动时加载 isDefault = true 的 Meta 数据到内存
  async onModuleInit() {
    await this.loadMetaToMemory();
  }

  // 加载 isDefault = true 的 Meta 数据到内存
  private async loadMetaToMemory(): Promise<void> {
    this.logger.log('Load Meta data into memory from database...');
    this.metaCache = await this.metaRepository.find({ where: { isDefault: true } });
    this.logger.log('Meta data loaded successfully!', JSON.stringify(plainToInstance(Meta, this.metaCache)));
  }

  // 获取内存中的 Meta 数据
  getMetaCache(): Meta[] {
    return this.metaCache;
  }

  // 创建 meta
  async create(metaData: Partial<Meta>): Promise<Meta> {
    const meta = this.metaRepository.create(metaData);
    const result = await this.metaRepository.save(meta);

    // 如果新创建的 meta 是默认的，更新内存缓存
    if (metaData.isDefault) {
      this.metaCache.push(result);
    }

    return plainToInstance(Meta, result);
  }

  // 查询所有 meta
  async findAll(
    options: PaginationOptions,
    name?: string,
    property?: string,
    isDefault?: boolean,
    resourceType?: string
  ): Promise<Pagination<Meta>> {

    const queryBuilder = this.metaRepository.createQueryBuilder("meta")

    if (name) {
      queryBuilder.andWhere("meta.name LIKE :name", {
        name: `%${name}%`,
      });
    }

    if (property) {
      queryBuilder.andWhere("meta.property LIKE :property", {
        property: `%${property}%`,
      });
    }

    if (resourceType) {
      queryBuilder.andWhere("meta.resourceType = :resourceType", { resourceType });
    }

    if (isDefault !== undefined) {
      queryBuilder.andWhere("meta.isDefault = :isDefault", { isDefault })
    }

    queryBuilder.orderBy("meta.createdAt", "DESC");
    queryBuilder.take(options.limit);
    queryBuilder.skip((options.page - 1) * options.limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    const _items = plainToInstance(Meta, items);

    return createPagination(_items, total, options);
  }

  // 查询站点默认 meta
  getBaseMeta(): Meta[] {
    return plainToInstance(Meta, this.metaCache); // 从内存中返回默认数据
  }

  // 根据 resource_type 和 resource_id 查询 meta
  async findByResource(resourceType: string, resourceId: number): Promise<Meta[]> {
    return plainToInstance(
      Meta,
      await this.metaRepository.find({
        where: { resourceType, resourceId },
      }),
    ); // 从数据库中查询
  }

  // 根据 ID 查询 meta
  async findOne(id: number): Promise<Meta> {
    const meta = await this.metaRepository.findOne({ where: { id } }); // 从数据库中查询
    if (!meta) {
      throw new NotFoundException('Meta not found');
    }
    return plainToInstance(Meta, meta);
  }

  // 更新 meta
  async update(id: number, updateData: Partial<Meta>): Promise<Meta> {
    const meta = await this.findOne(id);
    if (updateData.isDefault === true) {
      updateData.resourceType = null
      updateData.resourceId = null
    }
    Object.assign(meta, updateData);

    const result = await this.metaRepository.save(meta);

    // 如果更新后的 meta 是默认的，更新内存缓存
    if (updateData.isDefault) {
      const index = this.metaCache.findIndex((m) => m.id === id);
      if (index !== -1) {
        this.metaCache[index] = result; // 更新缓存中的记录
      } else {
        this.metaCache.push(result); // 添加到缓存
      }
    } else {
      // 如果更新后的 meta 不是默认的，从缓存中移除
      this.metaCache = this.metaCache.filter((m) => m.id !== id);
    }

    return plainToInstance(Meta, result);
  }

  // 删除 meta
  async remove(id: number): Promise<void> {
    const meta = await this.findOne(id);
    await this.metaRepository.remove(meta);

    // 从内存缓存中移除
    this.metaCache = this.metaCache.filter((m) => m.id !== id);
  }
}
