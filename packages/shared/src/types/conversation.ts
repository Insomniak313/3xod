export interface UserPreference {
  key: 'budget' | 'distance' | 'ambiance' | 'duration' | 'weatherTolerance';
  value: string;
}

export interface UserQuery {
  id: string;
  message: string;
  createdAt: string;
  preferences: UserPreference[];
}

export interface ConversationTurn {
  id: string;
  role: 'user' | 'assistant' | 'system';
  message: string;
  createdAt: string;
}

export interface ConversationContext {
  conversationId: string;
  turns: ConversationTurn[];
  latestPreferences: UserPreference[];
}
