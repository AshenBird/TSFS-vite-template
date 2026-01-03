// 与后端 TRPCService 中的 AppRouter 类型一致
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/types';
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    // HTTP 链接：指向后端 tRPC 服务地址
    httpBatchLink({
      url: '/trpc', // 后端 NestJS tRPC 地址
    }),
  ],
});