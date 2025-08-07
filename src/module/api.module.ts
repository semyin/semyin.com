
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { HomeModule } from './home/home.module';
import { AboutModule } from './about/about.module';
import { DetailModule } from './detail/detail.module';
import { ApiController } from './api.controller';

@Module({
  controllers: [ApiController],
  imports: [
    HomeModule,
    AboutModule,
    DetailModule,
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
        children: [
          {
            path: 'home',
            module: HomeModule,
          },
          {
            path: 'about',
            module: AboutModule,
          },
          {
            path: 'detail',
            module: DetailModule,
          },
        ],
      },
    ]),

  ],
})
export class ApiModule { }
