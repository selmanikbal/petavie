import { QueryClient } from '@tanstack/react-query';

/**
 * Server state lives here. Client/UI state belongs in Zustand.
 *
 * Defaults are tuned for mobile: cached data stays usable while offline and
 * requests are not retried forever on a flaky connection.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
        // Keep showing cached data instead of an error screen when offline.
        networkMode: 'offlineFirst',
      },
      mutations: {
        retry: 0,
        networkMode: 'online',
      },
    },
  });
}
