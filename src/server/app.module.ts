import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TRPCService } from './trpc/trpc.service';
import { PostModule } from './post/post.module';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule, PostModule], // 必须导入 DiscoveryModule
  controllers: [AppController],
  providers: [AppService, TRPCService],
})
export class AppModule {}
