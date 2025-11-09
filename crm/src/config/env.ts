

const getEnv = (key: string, required = true): string => {
  const value = import.meta.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
};




export const env = {
    BACKEND_URL: getEnv('VITE_BACKEND_URL'),
};
