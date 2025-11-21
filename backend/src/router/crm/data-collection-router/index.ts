import { Router, type Router as RouterType } from 'express';
import { ensure } from '../../../types/ensure.js';
import { sendTelegramMessage } from '../../../services/telegram-bot-service.js';
import { env } from '../../../config/env.js';
import { asyncErrorHandler } from '../../../middleware/error-middleware.js';

const dataCollectionRouter = Router();
const baseVersion = '/v1';
const baseRoute = '/message';

dataCollectionRouter.post(
  `${baseVersion}${baseRoute}/telegram`,
  asyncErrorHandler(async (req, res) => {
    const { phoneNumber, message } = req.body;
    ensure(phoneNumber, 'phoneNumber is required');
    ensure(message, 'message is required');
    await sendTelegramMessage(
      env.TELEGRAM_GROUP_ID,
      `Message from: ${phoneNumber}\n\n${message}`
    );
    return res.status(200).json({ success: true });
  })
);

export default [dataCollectionRouter] as RouterType[];
