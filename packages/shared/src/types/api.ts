import { DestinationCard } from './destination.js';
import { ConversationContext, UserPreference } from './conversation.js';

export interface DestinationQueryPayload {
  question: string;
  conversationId?: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  preferences?: UserPreference[];
}

export interface DestinationQueryResponse {
  conversation: ConversationContext;
  cards: DestinationCard[];
}
