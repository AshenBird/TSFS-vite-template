import 'reflect-metadata';
import { ZodSchema } from 'zod';

export const TRPC_METADATA_KEY = 'TRPC_METADATA';
export const TRPC_CONTROLLER_KEY = 'TRPC_CONTROLLER_KEY';

export interface TrpcProcedureMetadata {
  type: 'query' | 'mutation';
  name: string;
  inputSchema?: ZodSchema;
  outputSchema?: ZodSchema;
}

// 新增：类装饰器，用于标记该 Controller 需要被自动扫描注册到 tRPC
export function TrpcController(namespace?: string) {
  return function (target: Function) {
    Reflect.defineMetadata(TRPC_CONTROLLER_KEY, { namespace }, target);
  };
}

export function TrpcQuery(options?: { name?: string; input?: ZodSchema; output?: ZodSchema }) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const metadata: TrpcProcedureMetadata = {
      type: 'query',
      name: options?.name || propertyKey,
      inputSchema: options?.input,
      outputSchema: options?.output,
    };
    Reflect.defineMetadata(TRPC_METADATA_KEY, metadata, target, propertyKey);
  };
}

export function TrpcMutation(options?: { name?: string; input?: ZodSchema; output?: ZodSchema }) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const metadata: TrpcProcedureMetadata = {
      type: 'mutation',
      name: options?.name || propertyKey,
      inputSchema: options?.input,
      outputSchema: options?.output,
    };
    Reflect.defineMetadata(TRPC_METADATA_KEY, metadata, target, propertyKey);
  };
}
