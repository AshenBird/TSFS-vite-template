import { Injectable, OnModuleInit } from '@nestjs/common';
import { router, procedure, mergeRouters } from './trpc.base';
import { buildRouterFromController } from './trpc.helper';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { TRPC_CONTROLLER_KEY } from './trpc.decorator';

@Injectable()
export class TRPCService implements OnModuleInit {
  // 初始是一个空路由，onModuleInit 中会填充
  public router = router({});
  
  public caller: ReturnType<typeof this.router.createCaller>;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    const controllers = this.discoveryService.getControllers();
    const routerMap: Record<string, any> = {};

    controllers.forEach((wrapper) => {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) {
        return;
      }

      // 检查是否有 @TrpcController 装饰器
      const trpcMetadata = this.reflector.get(TRPC_CONTROLLER_KEY, metatype);
      if (trpcMetadata) {
        // 构建该 Controller 的子路由
        const controllerRouter = buildRouterFromController(instance);
        
        // 确定命名空间
        // 优先使用装饰器参数，如果没有，可以使用类名转换（这里简单处理，必须指定）
        const namespace = trpcMetadata.namespace;
        if (namespace) {
          routerMap[namespace] = controllerRouter;
        }
      }
    });

    // 定义全局路由
    const globalRouter = router({
      getUserList: procedure.query(() => {
        return [
          { id: 1, name: '张三', age: 20 },
          { id: 2, name: '李四', age: 22 },
        ];
      }),
    });

    // 合并所有路由
    this.router = mergeRouters(globalRouter, router(routerMap));
    
    // 更新 caller
    this.caller = this.router.createCaller({});
  }
}

// ⚠️ 注意：
// 由于路由是动态生成的，TypeScript 无法自动推导 AppRouter 的类型。
// 为了保证前端类型安全，我们需要手动定义 AppRouter 类型。
// 我们将在 app.router.ts 中处理类型聚合。
export type { AppRouter } from './app.router';