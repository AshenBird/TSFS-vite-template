import { Module } from '@nestjs/common';
import { TRPCService } from './trpc.service';

@Module({
  providers: [TRPCService],
  exports: [TRPCService], // 导出供其他模块使用
})
export class TRPCModule {}