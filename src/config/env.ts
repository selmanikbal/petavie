import Constants from 'expo-constants';
import { z } from 'zod';

/**
 * Runtime configuration. User data stays on this device — there is no cloud backend.
 */
const envSchema = z.object({
  appEnv: z.enum(['development', 'staging', 'production']).catch('development'),
});

export type Env = z.infer<typeof envSchema>;

const rawExtra = Constants.expoConfig?.extra ?? {};

export const env: Env = envSchema.parse(rawExtra);

export const isDevelopment: boolean = env.appEnv === 'development';
