import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation.js';
import { ConversationModule } from './conversation/conversation.module.js';
import { WeatherModule } from './weather/weather.module.js';
import { DestinationsModule } from './destinations/destinations.module.js';
import { LangchainModule } from './langchain/langchain.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      cache: true,
      expandVariables: true,
    }),
    WeatherModule,
    DestinationsModule,
    LangchainModule,
    ConversationModule,
  ],
})
export class AppModule {}
