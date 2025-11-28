import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller.js';
import { ConversationService } from './conversation.service.js';
import { ConversationStore } from '../common/conversation.store.js';
import { WeatherModule } from '../weather/weather.module.js';
import { DestinationsModule } from '../destinations/destinations.module.js';
import { LangchainModule } from '../langchain/langchain.module.js';

@Module({
  imports: [WeatherModule, DestinationsModule, LangchainModule],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationStore],
})
export class ConversationModule {}
