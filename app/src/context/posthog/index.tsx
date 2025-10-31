import { PostHogProvider } from 'posthog-js/react';
import type { FC, ReactNode } from 'react';
import {
  isDev,
  VITE_PUBLIC_POSTHOG_HOST,
  VITE_PUBLIC_POSTHOG_KEY,
  VITE_PUBLIC_POSTHOG_UI_HOST,
} from '../../env';

export const PostHog: FC<{
  children: ReactNode;
}> = ({ children }) => {
  if (isDev) {
    return <>{children}</>;
  }
  return (
    <PostHogProvider
      apiKey={VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: VITE_PUBLIC_POSTHOG_HOST,
        ui_host: VITE_PUBLIC_POSTHOG_UI_HOST,
        defaults: '2025-05-24',
        capture_exceptions: true, // enables capturing exceptions
        debug: import.meta.env.MODE === 'development',
      }}
    >
      {children}
    </PostHogProvider>
  );
};
