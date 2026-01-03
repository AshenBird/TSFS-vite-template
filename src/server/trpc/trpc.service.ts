import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// 初始化 tRPC（无上下文，若需上下文可添加 ctx 配置）
const t = initTRPC.create();

@Injectable()
export class TRPCService {
  // 创建 tRPC Router
  public readonly router = t.router({
    // 定义第一个接口：hello（接收 name 参数，返回问候语）
    hello: t.procedure
      .input(z.object({ name: z.string().optional().default('World') })) // Zod 验证输入
      .query(({ input }) => {
        return { message: `Hello ${input.name}! From NestJS + tRPC` };
      }),

    // 可扩展更多接口：比如获取用户列表
    getUserList: t.procedure.query(() => {
      return [
        { id: 1, name: '张三', age: 20 },
        { id: 2, name: '李四', age: 22 },
      ];
    }),
  });

  // 暴露 tRPC 的 caller（供后端内部调用，可选）
  public readonly caller = this.router.createCaller({});
}

// 导出 Router 类型（供前端使用，关键！实现类型安全）
export type AppRouter = TRPCService['router'];