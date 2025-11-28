import { WeatherSnapshot } from './weather.js';

export interface DestinationAction {
  label: string;
  actionType: 'openLink' | 'askMore' | 'save' | 'share';
  payload?: Record<string, unknown>;
}

export interface DestinationCard {
  id: string;
  name: string;
  city: string;
  country: string;
  shortDescription: string;
  budgetLevel: 'low' | 'medium' | 'high';
  highlights: string[];
  imageUrl: string;
  suitabilityScore: number;
  weather?: WeatherSnapshot;
  tags: string[];
  actions: DestinationAction[];
}

export interface DestinationSuggestion {
  id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  heroImageUrl: string;
  categories: string[];
  budgetLevel: 'low' | 'medium' | 'high';
  estimatedCost: number;
  tags: string[];
}
