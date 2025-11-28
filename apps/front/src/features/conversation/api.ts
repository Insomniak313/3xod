import {
  DestinationQueryPayload,
  DestinationQueryResponse,
} from '@3xod/shared';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const postConversationQuery = async (
  payload: DestinationQueryPayload,
): Promise<DestinationQueryResponse> => {
  const response = await fetch(`${API_URL}/conversation/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, preferences: payload.preferences ?? [] }),
  });

  if (!response.ok) {
    throw new Error('Conversation API indisponible pour le moment');
  }

  return response.json();
};
