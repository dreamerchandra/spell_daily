# Telegram Bot Router

This router handles Telegram bot webhook updates and provides bot information endpoints.

## Endpoints

### POST `/api/v1/telegram/webhook`
Receives webhook updates from Telegram. This endpoint should be registered with Telegram as your bot's webhook URL.

**Request Body**: Telegram Update object
**Response**: `{ ok: true }`

### GET `/api/v1/telegram/info`
Returns information about the bot.

**Response**:
```json
{
  "bot": {
    "id": 123456789,
    "username": "your_bot",
    "firstName": "Your Bot Name"
  }
}
```

## Setup

### 1. Set Environment Variable
Add your Telegram bot token to `.env`:
```env
TELEGRAM_BOT_TOKEN="your_bot_token_here"
```

### 2. Set Webhook

**Easiest Method: Use the Setup Script** ✨
```bash
./bot_setup.sh
```

The script will prompt you for:
- Bot token
- Base URL (e.g., `https://your-domain.com`)

It automatically appends `/api/v1/telegram/webhook` and configures the webhook.

**Alternative Methods:**

**Option A: Using curl**
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/api/v1/telegram/webhook"}'
```

**Option B: Using browser**
Visit:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-domain.com/api/v1/telegram/webhook
```

**Option C: Using the Telegram API in code**
```typescript
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(token);
await bot.setWebHook('https://your-domain.com/api/v1/telegram/webhook');
```

### 3. Test the Bot
Send a message to your bot on Telegram. The bot will echo back your message.

## Message Flow

1. User sends message to bot on Telegram
2. Telegram sends webhook POST to `/api/v1/telegram/webhook`
3. Server processes the message in `handleMessage()`
4. Bot replies back to the user

## Current Behavior

The bot currently echoes back any text message it receives:
- User sends: "Hello"
- Bot replies: "You said: Hello"

You can customize the `handleMessage()` function in `bot.ts` to implement your own logic.

## Local Development

For local development, you can use a tunneling service like ngrok:

```bash
ngrok http 3000
```

Then set your webhook to the ngrok URL:
```
https://your-ngrok-url.ngrok.io/api/v1/telegram/webhook
```

## Notes

- The bot uses webhook mode (not polling) for production efficiency
- All messages are logged with request ID for tracking
- Errors are handled and logged appropriately
