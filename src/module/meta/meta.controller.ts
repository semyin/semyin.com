import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { MetaService } from './meta.service';
import { Meta } from './meta.entity';
import { JwtAuthGuard } from '@/module/auth/jwt-auth.guard';
import { Pagination } from '@/interface/pagination.interface';
import { ParseOptionalBoolPipe } from '@/common/pipe/parse-optional-bool.pipe';

@Controller()
export class MetaController {
  constructor(private readonly metaService: MetaService) { }

  @Get()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Query("name") name?: string | undefined,
    @Query("property") property?: string | undefined,
    @Query("isDefault", ParseOptionalBoolPipe) isDefault?: boolean,
    @Query("resourceType") resourceType?: string | undefined,
  ): Promise<Pagination<Meta>> {
    return await this.metaService.findAll(
      { page, limit },
      name,
      property,
      isDefault,
      resourceType
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Meta> {
    return await this.metaService.findOne(id);
  }

  @Get('resource/:resourceType/:resourceId')
  async findByResource(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: number,
  ): Promise<Meta[]> {
    return await this.metaService.findByResource(resourceType, resourceId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() metaData: Partial<Meta>): Promise<Meta> {
    return await this.metaService.create(metaData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() updateData: Partial<Meta>): Promise<Meta> {
    return await this.metaService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return await this.metaService.remove(id);
  }
}
