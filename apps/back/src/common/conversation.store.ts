import { Injectable } from '@nestjs/common';
import {
  ConversationContext,
  ConversationTurn,
  UserPreference,
} from '@3xod/shared';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ConversationStore {
  private readonly conversations = new Map<string, ConversationContext>();

  upsertConversation(
    conversationId: string | undefined,
    turn: ConversationTurn,
    preferences: UserPreference[],
  ): ConversationContext {
    const id = conversationId ?? randomUUID();
    const current = this.conversations.get(id) ?? {
      conversationId: id,
      turns: [],
      latestPreferences: [],
    };

    const updated: ConversationContext = {
      conversationId: id,
      turns: [...current.turns, turn],
      latestPreferences: preferences.length > 0 ? preferences : current.latestPreferences,
    };

    this.conversations.set(id, updated);
    return updated;
  }

  getConversation(conversationId: string): ConversationContext | undefined {
    return this.conversations.get(conversationId);
  }
}
