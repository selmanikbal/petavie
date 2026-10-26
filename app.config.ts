import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Environment-aware Expo config.
 *
 * `APP_ENV` selects the environment (development | staging | production).
 * Only PUBLIC values may be placed in `extra`: everything here is shipped
 * inside the app bundle.
 */
type AppEnv = 'development' | 'staging' | 'production';

const APP_ENV = (process.env.APP_ENV ?? 'development') as AppEnv;

const environments: Record<AppEnv, { name: string; scheme: string; bundleId: string }> = {
  development: {
    name: 'Petavie (Dev)',
    scheme: 'petavie-dev',
    bundleId: 'com.petavie.app.dev',
  },
  staging: {
    name: 'Petavie (Staging)',
    scheme: 'petavie-staging',
    bundleId: 'com.petavie.app.staging',
  },
  production: {
    name: 'Petavie',
    scheme: 'petavie',
    bundleId: 'com.petavie.app',
  },
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = environments[APP_ENV];

  return {
    ...config,
    name: env.name,
    // Must match the EAS project linked by extra.eas.projectId (@selmanreiss-team/selman-reis).
    slug: 'selman-reis',
    scheme: env.scheme,
    ios: {
      ...config.ios,
      bundleIdentifier: env.bundleId,
      // iPhone only: iPad would require iPad screenshots and an iPad-tested layout.
      supportsTablet: false,
    },
    android: {
      ...config.android,
      package: env.bundleId,
      softwareKeyboardLayoutMode: 'resize',
    },
    extra: {
      ...config.extra,
      appEnv: APP_ENV,
    },
  };
};
