import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  WEATHER_API_BASE: z
    .string()
    .url()
    .default('https://api.open-meteo.com/v1/forecast'),
  DESTINATION_API_URL: z.string().url().optional(),
  DESTINATION_API_KEY: z.string().optional(),
});

export type EnvVars = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): EnvVars => {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new Error(`Validation des variables d'environnement échouée: ${issues}`);
  }

  return parsed.data;
};
