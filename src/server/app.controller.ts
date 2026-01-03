import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { router, procedure, z } from './trpc/trpc.base';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 定义该控制器的 tRPC 路由
  public readonly trpcRouter = router({
    hello: procedure
      .input(z.object({ name: z.string().optional().default('World') }))
      .query(({ input }) => {
        return { message: `${this.appService.getHello()} (TRPC: ${input.name})` };
      }),
  });
}
