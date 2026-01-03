import { initTRPC } from '@trpc/server';
import { z } from 'zod';

// 初始化 tRPC（无上下文，若需上下文可添加 ctx 配置）
const t = initTRPC.create();

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
export { z };
