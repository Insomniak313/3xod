import { z } from 'zod';

export const destinationActionSchema = z.object({
  label: z.string().min(1),
  actionType: z.enum(['openLink', 'askMore', 'save', 'share']),
  payload: z.record(z.unknown()).optional(),
});

export const destinationCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  country: z.string(),
  shortDescription: z.string(),
  budgetLevel: z.enum(['low', 'medium', 'high']),
  highlights: z.array(z.string()),
  imageUrl: z.string().url(),
  suitabilityScore: z.number().min(0).max(1),
  weather: z
    .object({
      provider: z.enum(['open-meteo', 'tomorrow-io', 'unknown']),
      observationTime: z.string(),
      temperatureCelsius: z.number(),
      feelsLikeCelsius: z.number(),
      description: z.string(),
      humidity: z.number(),
      windKph: z.number(),
      icon: z.string(),
      alerts: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            severity: z.enum(['info', 'watch', 'warning']),
            description: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
  tags: z.array(z.string()),
  actions: z.array(destinationActionSchema),
});

export type DestinationCardInput = z.infer<typeof destinationCardSchema>;
