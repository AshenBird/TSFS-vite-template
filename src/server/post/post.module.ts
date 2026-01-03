import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [
    PostService, 
    // 为了让 TRPCService 能够注入 PostController 并获取其 trpcRouter，
    // 我们需要将 PostController 也作为一个 Provider 导出。
    // 注意：这会导致 PostController 被实例化两次（一次作为 Controller，一次作为 Provider），
    // 但由于 Controller 本身应该是无状态的（状态在 Service 中），所以这通常是可以接受的。
    PostController
  ],
  exports: [PostController],
})
export class PostModule {}
