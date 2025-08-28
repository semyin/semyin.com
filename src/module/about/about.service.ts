import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { About } from './about.entity';
import { plainToInstance } from 'class-transformer';
import { MetaService } from '../meta/meta.service';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About)
    private readonly aboutRepository: Repository<About>,
    private readonly metaService: MetaService,
  ) {}

  private async createDefaultAbout(): Promise<About> {
    const about = this.aboutRepository.create({
      title: '关于',
      content: '这里是关于页面的内容，请编辑修改。',
      summary: '关于页面',
      authorId: 1,
      isPublished: false
    });
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

  async update(
    title: string, 
    content: string, 
    summary?: string, 
    coverImage?: string, 
    isPublished?: boolean
  ): Promise<About> {
    let about = await this.aboutRepository.findOne({
      order: { id: 'ASC' }
    });
    
    if (!about) {
      about = await this.createDefaultAbout();
    }
    
    about.title = title;
    about.content = content;
    if (summary !== undefined) {
      about.summary = summary;
    }
    if (coverImage !== undefined) {
      about.coverImage = coverImage;
    }
    if (isPublished !== undefined) {
      about.isPublished = isPublished;
    }
    
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