import { Controller, Get, Post as HttpPost, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { z } from 'zod';
import { TrpcQuery, TrpcMutation, TrpcController } from '../trpc/trpc.decorator';

@TrpcController('post') // 标记为 tRPC 控制器，命名空间为 'post'
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // --- REST API 定义 ---

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @HttpPost()
  create(@Body() body: { title: string; content: string }) {
    return this.postService.create(body.title, body.content);
  }

  // --- tRPC 自动化定义 ---
  // 使用装饰器标记方法，它们会被自动注册到 tRPC Router

  @TrpcQuery({ 
    name: 'list', // 显式指定 tRPC procedure 名称
    output: z.array(z.object({ id: z.number(), title: z.string(), content: z.string() })) 
  })
  async trpcList() {
    return this.postService.findAll();
  }

  @TrpcQuery({
    name: 'byId',
    input: z.object({ id: z.number() })
  })
  async trpcById(input: { id: number }) {
    return this.postService.findOne(input.id);
  }

  @TrpcMutation({
    name: 'create',
    input: z.object({ title: z.string(), content: z.string() })
  })
  async trpcCreate(input: { title: string; content: string }) {
    return this.postService.create(input.title, input.content);
  }
}
