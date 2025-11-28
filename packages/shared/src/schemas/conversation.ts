import { z } from 'zod';

export const preferenceSchema = z.object({
  key: z.enum(['budget', 'distance', 'ambiance', 'duration', 'weatherTolerance']),
  value: z.string().min(1),
});

export const userQuerySchema = z.object({
  id: z.string(),
  message: z.string().min(1),
  createdAt: z.string(),
  preferences: z.array(preferenceSchema),
});

export const conversationTurnSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  message: z.string(),
  createdAt: z.string(),
});

export const conversationContextSchema = z.object({
  conversationId: z.string(),
  turns: z.array(conversationTurnSchema),
  latestPreferences: z.array(preferenceSchema),
});
