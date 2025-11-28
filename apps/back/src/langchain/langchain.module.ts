import { Module } from '@nestjs/common';
import { LangchainService } from './langchain.service.js';

@Module({
  providers: [LangchainService],
  exports: [LangchainService],
})
export class LangchainModule {}
