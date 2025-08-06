import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { reactSsrMiddleware } from "./middleware/reactSsr.middleware";

@Module({
	controllers: [AppController],
	imports: [],
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
