import { router, procedure } from './trpc.base';
import { ControllerToRouter } from './trpc.helper';

// 导入所有需要暴露给 tRPC 的控制器
import { PostController } from '../post/post.controller';
import { AppController } from '../app.controller';

// 定义全局 Procedure 的类型（与 TRPCService 中的 globalRouter 保持一致）
const globalRouter = router({
  getUserList: procedure.query(async () => {
    return [] as { id: number; name: string; age: number }[];
  }),
});

// 手动聚合类型
// 虽然这需要手动维护，但它是保证类型安全且运行时解耦的最佳实践
export const appRouter = router({
  // 合并全局路由
  ...globalRouter._def.procedures,
  
  // 映射 Controller 路由
  // 注意：这里需要与 @TrpcController('namespace') 中的 namespace 对应
  post: {} as unknown as ControllerToRouter<PostController>,
  // app: {} as unknown as ControllerToRouter<AppController>, // 如果 AppController 也加了装饰器
});

export type AppRouter = typeof appRouter;
