import analyticsRouter from './analytics-router/index.js';
import healthRouter from './health-router/index.js';
import telegramRouter from './telegram-router/index.js';

export default [...healthRouter, ...telegramRouter, ...analyticsRouter];
