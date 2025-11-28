import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ConversationContext,
  DestinationCard,
  DestinationQueryResponse,
} from '@3xod/shared';
import { postConversationQuery } from './api.js';
import { useAppSelector } from '../../hooks/useRedux.js';
import { selectUserPreferences } from '../preferences/preferences.slice.js';

interface ConversationFlowState {
  cards: DestinationCard[];
  conversation: ConversationContext | null;
  lastQuestion?: string;
}

export const useConversationFlow = () => {
  const [state, setState] = useState<ConversationFlowState>({ cards: [], conversation: null });
  const preferences = useAppSelector(selectUserPreferences);

  const mutation = useMutation({
    mutationFn: async (question: string): Promise<DestinationQueryResponse> => {
      return postConversationQuery({
        question,
        preferences,
        conversationId: state.conversation?.conversationId,
      });
    },
    onSuccess: (data, variables) => {
      setState({ cards: data.cards, conversation: data.conversation, lastQuestion: variables });
    },
  });

  return {
    ...state,
    askQuestion: (question: string) => mutation.mutate(question),
    isLoading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : undefined,
  };
};
