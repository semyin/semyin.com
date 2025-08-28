import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { About } from './about.entity';
import { plainToInstance } from 'class-transformer';
import { MetaService } from '../meta/meta.service';
import { UpdateAboutDto } from './dto/about.dto';
import { DEFAULT_ABOUT_DATA } from './constants/default-about';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
    private readonly metaService: MetaService,
  ) {}

  private async createDefaultAbout(): Promise<About> {
    const about = this.aboutRepository.create(DEFAULT_ABOUT_DATA);
    await this.aboutRepository.save(about);
    return about;
  }

  async getAbout(): Promise<About> {
    let about = await this.aboutRepository
      .createQueryBuilder('about')
      .leftJoinAndSelect('about.metas', 'metas', 'metas.resourceType = :resourceType', { resourceType: 'about' })
      .orderBy('about.id', 'ASC')
      .getOne();
    
    if (!about) {
      const defaultAbout = await this.createDefaultAbout();
      about = await this.aboutRepository
        .createQueryBuilder('about')
        .leftJoinAndSelect('about.metas', 'metas', 'metas.resourceType = :resourceType', { resourceType: 'about' })
        .where('about.id = :id', { id: defaultAbout.id })
        .getOne();
    }
    
    return plainToInstance(About, about);
  }

  async getAboutForAdmin(): Promise<About> {
    let about = await this.aboutRepository
      .createQueryBuilder('about')
      .leftJoinAndSelect('about.metas', 'metas', 'metas.resourceType = :resourceType', { resourceType: 'about' })
      .orderBy('about.id', 'ASC')
      .getOne();
    
    if (!about) {
      const defaultAbout = await this.createDefaultAbout();
      about = await this.aboutRepository
        .createQueryBuilder('about')
        .leftJoinAndSelect('about.metas', 'metas', 'metas.resourceType = :resourceType', { resourceType: 'about' })
        .where('about.id = :id', { id: defaultAbout.id })
        .getOne();
    }
    
    return plainToInstance(About, about);
  }

  async update(updateData: UpdateAboutDto): Promise<About> {
    let about = await this.aboutRepository
      .createQueryBuilder('about')
      .orderBy('about.id', 'ASC')
      .getOne();
    
    if (!about) {
      about = await this.createDefaultAbout();
    }
    
    // 使用Object.assign批量更新
    Object.assign(about, updateData);
    
    await this.aboutRepository.save(about);
    return plainToInstance(About, about);
  }

  async incrementViewCount(): Promise<void> {
    const about = await this.aboutRepository
      .createQueryBuilder('about')
      .orderBy('about.id', 'ASC')
      .getOne();
    
    if (about) {
      await this.aboutRepository.increment({ id: about.id }, 'viewCount', 1);
    }
  }
}