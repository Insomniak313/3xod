import { Injectable } from '@nestjs/common';
import {
  ConversationContext,
  ConversationTurn,
  DestinationCard,
  DestinationQueryResponse,
  UserPreference,
} from '@3xod/shared';
import { randomUUID } from 'node:crypto';
import { CreateQueryDto } from './dto/create-query.dto.js';
import { ConversationStore } from '../common/conversation.store.js';
import { WeatherService } from '../weather/weather.service.js';
import { DestinationsService } from '../destinations/destinations.service.js';
import { LangchainService } from '../langchain/langchain.service.js';

@Injectable()
export class ConversationService {
  constructor(
    private readonly store: ConversationStore,
    private readonly weatherService: WeatherService,
    private readonly destinationsService: DestinationsService,
    private readonly langchainService: LangchainService,
  ) {}

  async handleQuery(dto: CreateQueryDto): Promise<DestinationQueryResponse> {
    const preferences = dto.preferences ?? [];

    const userTurn: ConversationTurn = {
      id: randomUUID(),
      role: 'user',
      message: dto.question,
      createdAt: new Date().toISOString(),
    };

    const conversation = this.store.upsertConversation(
      dto.conversationId,
      userTurn,
      preferences,
    );

    const weather = dto.location
      ? await this.weatherService.getSnapshot(dto.location)
      : undefined;

    const suggestions = await this.destinationsService.fetchSuggestions({
      question: dto.question,
      preferences,
      location: dto.location,
    });

    const cards = await this.langchainService.rankDestinations({
      question: dto.question,
      suggestions,
      preferences,
      weather,
      conversation,
    });

    const assistantTurn: ConversationTurn = {
      id: randomUUID(),
      role: 'assistant',
      message: this.buildAssistantMessage(cards, weather),
      createdAt: new Date().toISOString(),
    };

    const updatedConversation = this.store.upsertConversation(
      conversation.conversationId,
      assistantTurn,
      preferences,
    );

    return {
      conversation: updatedConversation,
      cards,
    } satisfies DestinationQueryResponse;
  }

  private buildAssistantMessage(cards: DestinationCard[], weather?: unknown): string {
    if (cards.length === 0) {
      return "Je n'ai pas trouvé d'options pertinentes pour le moment, reformulons.";
    }

    const top = cards
      .slice(0, 2)
      .map((card) => `${card.name} (${card.city})`)
      .join(' et ');

    const weatherSummary = weather
      ? 'Les conditions météo ont été prises en compte pour affiner la sélection.'
      : 'Je peux affiner encore plus si tu me donnes une localisation.';

    return `${top} semblent correspondre à ta recherche. ${weatherSummary}`;
  }
}
