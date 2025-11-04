#!/bin/bash

set -e

echo "================================"
echo "Telegram Bot Webhook Setup"
echo "================================"
echo ""

if [ -f .env ]; then
  BOT_TOKEN_DEFAULT=$(grep TELEGRAM_BOT_TOKEN .env | cut -d '=' -f2 | tr -d '"')
  if [ ! -z "$BOT_TOKEN_DEFAULT" ]; then
    echo "Found bot token in .env"
    read -p "Use token from .env? (y/n) [y]: " USE_ENV_TOKEN
    USE_ENV_TOKEN=${USE_ENV_TOKEN:-y}

    if [ "$USE_ENV_TOKEN" = "y" ] || [ "$USE_ENV_TOKEN" = "Y" ]; then
      BOT_TOKEN="$BOT_TOKEN_DEFAULT"
      echo "Using token: ${BOT_TOKEN:0:10}..."
      echo ""
    fi
  fi
fi

if [ -z "$BOT_TOKEN" ]; then
  read -p "Enter your Telegram Bot Token: " BOT_TOKEN
  echo ""
fi

read -p "Enter your webhook base URL (e.g., https://example.com): " BASE_URL
echo ""

if [ -z "$BOT_TOKEN" ]; then
  echo "❌ Error: Bot token cannot be empty"
  exit 1
fi

if [ -z "$BASE_URL" ]; then
  echo "❌ Error: Base URL cannot be empty"
  exit 1
fi

BASE_URL="${BASE_URL%/}"
WEBHOOK_URL="${BASE_URL}/api/v1/telegram/webhook"

echo "Setting webhook to: $WEBHOOK_URL"
echo ""

RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_URL}\"}")

echo "Response from Telegram:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

if echo "$RESPONSE" | grep -q '"ok":true'; then
  echo "✅ Webhook set successfully!"
  echo ""
  echo "Verify webhook with:"
  echo "  curl -s \"https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo\" | python3 -m json.tool"
  echo ""
  echo "Test your bot by sending a message on Telegram!"
else
  echo "❌ Failed to set webhook. Check the response above."
  exit 1
fi
