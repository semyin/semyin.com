import { Controller, Get, Body, Put, UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
import { About } from './about.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateAboutDto } from './dto/about.dto';

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
  async update(@Body() updateData: UpdateAboutDto): Promise<About> {
    return this.aboutService.update(updateData);
  }
}