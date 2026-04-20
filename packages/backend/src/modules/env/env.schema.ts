import z from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_SECURE: z.preprocess((value) => {
    if (value === undefined || value === null || value === '') {
      return false;
    }
    if (typeof value === 'string') {
      if (value === 'true' || value === '1') {
        return true;
      }
      if (value === 'false' || value === '0') {
        return false;
      }
    }
    return value;
  }, z.boolean()),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  REDIS_URL: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
