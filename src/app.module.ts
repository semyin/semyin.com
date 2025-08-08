import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { ApiModule } from "./module/api.module";
import { reactSsrMiddleware } from "./middleware/reactSsr.middleware";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApiModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 对所有非 API 路由应用 React SSR 中间件
    consumer
      .apply(reactSsrMiddleware)
      .exclude('api/(.*)')  // 排除所有 API 路由
      .forRoutes('*');
  }
}
