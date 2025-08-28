import { Controller, Get, Body, Put, UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
import { About } from './about.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  async getAbout(): Promise<About> {
    const about = await this.aboutService.getAbout();
    await this.aboutService.incrementViewCount();
    return about;
  }

  @Get('manage')
  @UseGuards(JwtAuthGuard)
  async getAboutForAdmin(): Promise<About> {
    return this.aboutService.getAboutForAdmin();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('summary') summary?: string,
    @Body('coverImage') coverImage?: string,
    @Body('isPublished') isPublished?: boolean,
  ): Promise<About> {
    return this.aboutService.update(title, content, summary, coverImage, isPublished);
  }
}