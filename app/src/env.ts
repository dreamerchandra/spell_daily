export const VITE_PUBLIC_POSTHOG_KEY = import.meta.env
  .VITE_PUBLIC_POSTHOG_KEY as string;
export const VITE_PUBLIC_POSTHOG_HOST = import.meta.env
  .VITE_PUBLIC_POSTHOG_HOST as string;
export const VITE_PUBLIC_POSTHOG_UI_HOST = import.meta.env
  .VITE_PUBLIC_POSTHOG_UI_HOST as string;

export const isDev =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1';
