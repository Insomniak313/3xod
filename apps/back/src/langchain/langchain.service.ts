import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import {
  ConversationContext,
  DestinationCard,
  DestinationSuggestion,
  UserPreference,
  WeatherSnapshot,
} from '@3xod/shared';

interface RankDestinationsInput {
  question: string;
  suggestions: DestinationSuggestion[];
  preferences: UserPreference[];
  weather?: WeatherSnapshot;
  conversation: ConversationContext;
}

interface StructuredCard {
  id: string;
  shortDescription: string;
  highlights: string[];
  suitabilityScore: number;
  tags: string[];
}

@Injectable()
export class LangchainService {
  private readonly logger = new Logger(LangchainService.name);
  private readonly parser = StructuredOutputParser.fromZodSchema(
    z.object({
      cards: z.array(
        z.object({
          id: z.string(),
          shortDescription: z.string(),
          highlights: z.array(z.string()).max(3),
          suitabilityScore: z.number().min(0).max(1),
          tags: z.array(z.string()).max(5),
        }),
      ),
    }),
  );
  private readonly prompt = ChatPromptTemplate.fromTemplate(`
Tu es un travel planner français pour l'application 3xod.
Question utilisateur: {question}
Préférences déclarées: {preferences}
Météo: {weather}
Historique récent: {history}
Suggestions brutes: {suggestions}

Réponds uniquement via le format imposé.
{format_instructions}
  `.trim());
  private readonly model?: ChatOpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.model = new ChatOpenAI({
        apiKey,
        modelName: this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini',
        temperature: 0.2,
      });
    }
  }

  async rankDestinations(input: RankDestinationsInput): Promise<DestinationCard[]> {
    if (!this.model) {
      return this.heuristicFormat(input);
    }

    try {
      const chain = this.prompt.pipe(this.model).pipe(this.parser);
      const structured = await chain.invoke({
        question: input.question,
        preferences: JSON.stringify(input.preferences),
        weather: JSON.stringify(input.weather ?? {}),
        history: JSON.stringify(input.conversation.turns.slice(-4)),
        suggestions: JSON.stringify(input.suggestions),
        format_instructions: this.parser.getFormatInstructions(),
      });

      return this.mergeStructuredWithSuggestions(structured.cards, input);
    } catch (error) {
      this.logger.warn(
        `Impossible d'utiliser LangChain, fallback heuristique: ${
          error instanceof Error ? error.message : 'erreur inconnue'
        }`,
      );
      return this.heuristicFormat(input);
    }
  }

  private mergeStructuredWithSuggestions(
    cards: StructuredCard[],
    input: RankDestinationsInput,
  ): DestinationCard[] {
    const dictionary = new Map(
      input.suggestions.map((suggestion) => [suggestion.id, suggestion]),
    );

    return cards
      .map((card) => {
        const suggestion = dictionary.get(card.id);
        if (!suggestion) {
          return undefined;
        }

        return this.toDestinationCard(suggestion, card.suitabilityScore, card);
      })
      .filter((card): card is DestinationCard => Boolean(card));
  }

  private heuristicFormat(input: RankDestinationsInput): DestinationCard[] {
    return input.suggestions.slice(0, 6).map((suggestion, index) => {
      const scoreBoost = input.preferences.length > 0 ? 0.1 : 0;
      const randomScore = 0.5 + index * 0.05 + scoreBoost;
      return this.toDestinationCard(suggestion, Math.min(0.95, randomScore));
    });
  }

  private toDestinationCard(
    suggestion: DestinationSuggestion,
    suitabilityScore: number,
    structuredData?: StructuredCard,
  ): DestinationCard {
    return {
      id: suggestion.id,
      name: suggestion.name,
      city: suggestion.city,
      country: suggestion.country,
      shortDescription:
        structuredData?.shortDescription ?? suggestion.description.slice(0, 160),
      budgetLevel: suggestion.budgetLevel,
      highlights:
        structuredData?.highlights ?? suggestion.categories.slice(0, 3),
      imageUrl: suggestion.heroImageUrl,
      suitabilityScore,
      tags: structuredData?.tags ?? suggestion.tags.slice(0, 5),
      weather: undefined,
      actions: [
        {
          label: 'Voir les détails',
          actionType: 'askMore',
          payload: { destinationId: suggestion.id },
        },
        {
          label: 'Sauvegarder',
          actionType: 'save',
          payload: { destinationId: suggestion.id },
        },
      ],
    } satisfies DestinationCard;
  }
}
