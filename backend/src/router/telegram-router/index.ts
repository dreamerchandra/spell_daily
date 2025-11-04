import { Router, type Router as RouterType } from 'express';
import TelegramBot from 'node-telegram-bot-api';
import { handleMessage } from './bot.js';
import { logger } from '../../lib/logger.js';
import { telegramAdminMiddleware } from '../../middleware/admin_middleware.js';
import { bot } from '../../services/telegram-bot-service.js';

const telegramRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/telegram';

telegramRouter.post(
  `${baseVersion}${baseRoute}/webhook`,
  telegramAdminMiddleware,
  async (req, res) => {
    try {
      const update = req.body as TelegramBot.Update;

      await handleMessage(update);

      res.status(200).json({ ok: true });
    } catch (error) {
      logger.error('Error processing Telegram webhook', error);
      res.status(500).json({ ok: false, error: 'Internal server error' });
    }
  }
);

telegramRouter.get(`${baseVersion}${baseRoute}/info`, async (_req, res) => {
  try {
    const me = await bot.getMe();
    res.status(200).json({
      bot: {
        id: me.id,
        username: me.username,
        firstName: me.first_name,
      },
    });
  } catch (error) {
    logger.error('Failed to get bot info', error);
    res.status(500).json({ error: 'Failed to get bot info' });
  }
});

export default [telegramRouter] as RouterType[];
