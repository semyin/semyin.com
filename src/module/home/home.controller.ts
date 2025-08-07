import { Controller, Get } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  getHome() {
    return {
      msg: 'This is home page data from backend'
    }
  }
}