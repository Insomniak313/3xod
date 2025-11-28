import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service.js';
import { CreateQueryDto } from './dto/create-query.dto.js';
import { DestinationQueryResponse } from '@3xod/shared';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('query')
  async query(@Body() dto: CreateQueryDto): Promise<DestinationQueryResponse> {
    return this.conversationService.handleQuery(dto);
  }
}
