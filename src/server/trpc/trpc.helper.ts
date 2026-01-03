import { router, procedure } from './trpc.base';
import { TRPC_METADATA_KEY, TrpcProcedureMetadata } from './trpc.decorator';
import { ZodSchema } from 'zod';

// 运行时：扫描控制器并构建 Router
export function buildRouterFromController(controller: any) {
  const prototype = Object.getPrototypeOf(controller);
  const propertyNames = Object.getOwnPropertyNames(prototype);
  const procedures: Record<string, any> = {};

  for (const prop of propertyNames) {
    const metadata: TrpcProcedureMetadata = Reflect.getMetadata(TRPC_METADATA_KEY, prototype, prop);
    
    if (metadata) {
      let proc = procedure;

      // 1. 绑定 Input Schema
      if (metadata.inputSchema) {
        proc = proc.input(metadata.inputSchema);
      }

      // 2. 绑定 Output Schema (可选)
      if (metadata.outputSchema) {
        proc = proc.output(metadata.outputSchema);
      }

      // 3. 绑定 Handler
      // 注意：这里我们将控制器的上下文绑定到 handler 上
      const handler = controller[prop].bind(controller);

      // 4. 构建 Query 或 Mutation
      if (metadata.type === 'query') {
        procedures[metadata.name] = proc.query(async ({ input }) => {
          // 如果方法有参数，我们假设第一个参数是 input
          // 这里的 input 是经过 Zod 验证后的数据
          return handler(input);
        });
      } else if (metadata.type === 'mutation') {
        procedures[metadata.name] = proc.mutation(async ({ input }) => {
          return handler(input);
        });
      }
    }
  }

  return router(procedures);
}

// --- 类型工具：将 Controller 类转换为 Router 类型 ---
// 这里的魔法在于：我们假设 Controller 的方法签名直接对应 Procedure 的 Input/Output

// 提取方法的第一个参数作为 Input 类型
type GetInput<T> = T extends (input: infer I) => any ? I : void;
// 提取方法的返回值（Unwrapped Promise）作为 Output 类型
type GetOutput<T> = T extends (...args: any[]) => infer R 
  ? R extends Promise<infer U> ? U : R 
  : never;

// 判断是否是 tRPC 方法（这里简化为：只要是方法就被包含，或者你可以添加更复杂的过滤逻辑）
// 为了精确，我们可以结合方法名后缀或其他约定，但在类型层面很难读取装饰器。
// 所以这里我们假设 Controller 中 *被设计为 tRPC 接口* 的方法都符合特定签名。

// 这是一个 Helper 类型，用于构造 Procedure 类型
// 注意：这只是一个近似值，用于前端类型推导。
// 真正的运行时行为由 Zod Schema 决定，开发者必须保证 TS 类型和 Zod Schema 一致。
import { BuildProcedure } from '@trpc/server';

// 简化版类型映射
// 实际生产中可能需要更复杂的类型体操来区分 Query 和 Mutation，
// 但由于 TS 无法知道装饰器是 Query 还是 Mutation，
// 我们这里默认映射为 Query (或者 Mutation，取决于用途，或者都提供)。
// 为了安全，我们统一映射为 { query: ..., mutation: ... } 的混合体？不，tRPC 不支持。
// 
// 妥协方案：
// 我们无法自动推断是 Query 还是 Mutation。
// 所以，对于类型生成，我们可能需要用户手动指定，或者接受一个默认值。
// 
// 更好的方案：
// 我们不仅提供 buildRouterFromController，还提供一个类型定义工具，
// 让用户显式定义接口。
// 
// 但为了响应用户的“自动化”需求，我们尝试尽力而为：
// 我们将所有方法都映射为 Query (最常见) 和 Mutation (以此支持 client.xxx.query 和 client.xxx.mutate)
// 这在 tRPC 类型定义中是合法的吗？同一个 key 既是 Query 又是 Mutation？
// 是的，tRPC 允许 procedure 既有 query 也有 mutation 定义吗？不，通常是一个。
// 
// 修正：我们无法在类型层面自动区分。
// 所以，导出的类型可能需要手动维护，或者我们接受一个限制：
// "自动生成的类型默认视为 AnyProcedure，如果需要精确类型，请使用手动定义的 Router"
// 
// 再次修正：
// 既然用户想要“保证最终导出的 trpc 路由类型的正确性”，
// 我们必须让 TS 知道具体的 Procedure 类型。
// 
// 方案：ControllerToRouter<T> 只能生成一个大致的形状。
// 也许我们不需要在 TS 中自动转换 Controller -> Router。
// 我们在 TRPCService 中使用 buildRouterFromController 返回的值，
// 然后手动断言它的类型？
// 
// const postRouter = buildRouterFromController(this.postController) as any; // 运行时
// 
// 让我们试着写一个极其智能的类型转换器，
// 假设所有以 'query' 开头的方法是 Query，'mutate' 开头的是 Mutation？
// 或者简单点：所有方法都生成为 Procedure。
// 前端调用时，client.post.hello.query() 或 .mutate() 只要 Procedure 支持即可。
// 实际上，tRPC 的 Procedure 类型定义包含了 _def，里面有 type: 'query' | 'mutation'。
// 如果类型不对，前端会报错。
// 
// 最终决定：
// 我们提供一个 Utility Type，它将 Controller 的方法转换为 Procedure。
// 默认假设为 Query。如果需要 Mutation，用户可能需要手动 Override。
// 或者，我们不提供自动类型转换，而是**强烈建议用户在 Controller 中保留 trpcRouter 属性**，
// 只是这个属性的值是通过 buildRouterFromController(this) 生成的。
// 这样，trpcRouter 的类型就是 buildRouterFromController 返回的类型。
// 
// 问题是 buildRouterFromController 返回的是 Router<{ [key: string]: Procedure<...> }>，失去了具体的 key。
// 
// 真的没有办法了吗？
// 有。
// 我们让 buildRouterFromController 接收一个泛型 TController，
// 并返回一个 Mapped Type。
// 
// function buildRouterFromController<T>(controller: T): ControllerToRouter<T> { ... }
// 
// 这样我们就可以保留 key 和类型了！

import { AnyProcedure, ProcedureParams, ProcedureArgs } from '@trpc/server';

// 这是一个极其简化的类型映射，它假设所有方法都是 Query。
// 如果是 Mutation，前端调用 query() 可能会在运行时报错，或者类型提示不准确。
// 这是一个很难完全解决的 Trade-off。
export type ControllerToRouter<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: 
    T[K] extends (input: infer I) => Promise<infer O> | infer O
      ? any // 这里暂时返回 any procedure，因为构造精确的 Procedure 类型非常复杂且依赖内部类型
      : never
};

// 鉴于构造精确类型的难度，我们采取实用主义路线：
// 运行时：完全动态。
// 类型：我们建议用户在 TRPCService 中显式定义 Router 类型，或者使用我们提供的近似类型。
