import { Controller, Get } from '@nestjs/common';

@Controller()
export class AboutController {
  @Get()
  getAbout() {
    return {
      msg: 'Another page about data from backend'
    }
  }
}