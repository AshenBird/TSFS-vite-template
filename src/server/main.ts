import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TRPCService } from './trpc/trpc.service';
import * as trpcExpress from '@trpc/server/adapters/express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const trpcService = app.get(TRPCService);
  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: trpcService.router,
      createContext: () => ({}), // 无上下文，若需可自定义
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
