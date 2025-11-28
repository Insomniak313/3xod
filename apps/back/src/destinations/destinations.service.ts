import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomUUID } from 'node:crypto';
import { DestinationSuggestion, UserPreference } from '@3xod/shared';

interface SuggestionInput {
  question: string;
  preferences: UserPreference[];
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
}

const FALLBACK_DESTINATIONS: DestinationSuggestion[] = [
  {
    id: 'gaia-porto',
    name: 'Balade gastronomique à Porto',
    description:
      'Explore les ruelles colorées de Porto, profite des azulejos et dîners en rooftop avec vue sur le Douro.',
    city: 'Porto',
    country: 'Portugal',
    latitude: 41.1579,
    longitude: -8.6291,
    heroImageUrl: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad',
    categories: ['culture', 'gastronomie'],
    budgetLevel: 'medium',
    estimatedCost: 450,
    tags: ['week-end', 'urbain', 'ensoleillé'],
  },
  {
    id: 'fjord-chic',
    name: 'Echappée nature à Bergen',
    description:
      'Navigue sur les fjords norvégiens, randonne dans des paysages brumeux et goûte aux cafés cosy du centre.',
    city: 'Bergen',
    country: 'Norvège',
    latitude: 60.3913,
    longitude: 5.3221,
    heroImageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
    categories: ['nature', 'slow travel'],
    budgetLevel: 'high',
    estimatedCost: 900,
    tags: ['fraîcheur', 'randonnée'],
  },
  {
    id: 'sunset-marrakech',
    name: 'Immersion sensorielle à Marrakech',
    description:
      'Riads confidentiels, cuisine épicée, escapade au désert d’Agafay pour un coucher de soleil doré.',
    city: 'Marrakech',
    country: 'Maroc',
    latitude: 31.6295,
    longitude: -7.9811,
    heroImageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    categories: ['soleil', 'bien-être'],
    budgetLevel: 'low',
    estimatedCost: 380,
    tags: ['désert', 'artisanat'],
  },
];

@Injectable()
export class DestinationsService {
  private readonly logger = new Logger(DestinationsService.name);
  private readonly apiUrl?: string;
  private readonly apiKey?: string;

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('DESTINATION_API_URL');
    this.apiKey = this.configService.get<string>('DESTINATION_API_KEY');
  }

  async fetchSuggestions(input: SuggestionInput): Promise<DestinationSuggestion[]> {
    if (!this.apiUrl) {
      return this.applyPreferenceScore(FALLBACK_DESTINATIONS, input.preferences);
    }

    try {
      const { data } = await axios.get(this.apiUrl, {
        headers: this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : undefined,
        params: {
          q: input.question,
          latitude: input.location?.latitude,
          longitude: input.location?.longitude,
          tags: input.preferences.map((pref) => pref.value).join(','),
          limit: 6,
        },
      });

      const normalized: DestinationSuggestion[] = (data?.results ?? []).map(
        (item: any) => ({
          id: item.id ?? item.fsq_id ?? randomUUID(),
          name: item.name,
          description: item.description ?? 'Suggestion issue du fournisseur externe',
          city: item.location?.city ?? 'Inconnue',
          country: item.location?.country ?? 'Inconnue',
          latitude: item.geocodes?.main?.latitude ?? 0,
          longitude: item.geocodes?.main?.longitude ?? 0,
          heroImageUrl: item.image_url ?? item.photos?.[0]?.url ?? '',
          categories: item.categories?.map((cat: any) => cat.name) ?? [],
          budgetLevel: item.budget ?? 'medium',
          estimatedCost: Number(item.cost ?? 500),
          tags: item.tags ?? [],
        }),
      );

      return this.applyPreferenceScore(normalized, input.preferences);
    } catch (error) {
      this.logger.warn(
        `Impossible de récupérer les destinations externes: ${
          error instanceof Error ? error.message : 'erreur inconnue'
        }`,
      );
      return this.applyPreferenceScore(FALLBACK_DESTINATIONS, input.preferences);
    }
  }

  private applyPreferenceScore(
    suggestions: DestinationSuggestion[],
    preferences: UserPreference[],
  ): DestinationSuggestion[] {
    if (preferences.length === 0) {
      return suggestions;
    }

    const keywords = preferences.map((pref) => pref.value.toLowerCase());
    const withScore = suggestions.map((item) => ({
      ...item,
      score:
        keywords.filter((keyword) =>
          `${item.description} ${item.tags.join(' ')}`.toLowerCase().includes(keyword),
        ).length + Math.random() * 0.3,
    }));

    return withScore
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .map(({ score, ...rest }) => rest);
  }
}
