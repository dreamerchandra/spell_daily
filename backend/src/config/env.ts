import 'dotenv/config';

const getEnv = (key: string, required = true): string => {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
};

const getEnvOrDefault = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

const NODE_ENV = getEnvOrDefault('NODE_ENV', 'development');
const isDevelopment = NODE_ENV === 'development';
const isProduction = NODE_ENV === 'production';

export const env = {
  NODE_ENV,
  isDevelopment,
  isProduction,

  PORT: parseInt(getEnvOrDefault('PORT', '3000'), 10),
  LOG_LEVEL: getEnvOrDefault('LOG_LEVEL', isDevelopment ? 'debug' : 'info'),

  DATABASE_URL: getEnv('DATABASE_URL'),

  NEW_RELIC_LICENSE_KEY: getEnv('NEW_RELIC_LICENSE_KEY', isProduction),
  NEW_RELIC_APP_NAME: getEnv('NEW_RELIC_APP_NAME', isProduction),
  NEW_RELIC_LOG_LEVEL: getEnvOrDefault('NEW_RELIC_LOG_LEVEL', 'info'),

  TELEGRAM_BOT_TOKEN: getEnv('TELEGRAM_BOT_TOKEN'),
};
