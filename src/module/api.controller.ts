import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiController {
  @Get("/status")
  async status() {
    return {
      msg: 'status ok',
      time: new Date().getTime()
    }
  }

  @Get("/hello")
  async hello() {
    return {
      msg: 'hello world'
    }
  }
}
