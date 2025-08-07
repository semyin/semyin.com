import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class DetailController {
  @Get(':id')
  getDetail(@Param('id') id: string) {
    return {
      msg: 'Detail page id = ' + id + ' data from backend',
    };
  }
}
