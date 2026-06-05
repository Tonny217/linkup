require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL;
const POCKETBASE_URL = process.env.POCKETBASE_URL;

const bot = new TelegramBot(TOKEN, { polling: true });

// Start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Open LinkUp',
            web_app: { url: WEBAPP_URL }
          }
        ],
        [
          { text: 'My Profile', callback_data: 'profile' },
          { text: 'Matches', callback_data: 'matches' }
        ]
      ]
    }
  };

  bot.sendMessage(
    chatId,
    `Welcome to LinkUp, ${msg.from.first_name}!

` +
    'Find meaningful connections in your local community.

' +
    'Tap "Open LinkUp" to start swiping.',
    keyboard
  );
});

// Help command
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'LinkUp Bot Commands:

' +
    '/start - Open the dating app
' +
    '/profile - View your profile
' +
    '/matches - See your matches
' +
    '/settings - App settings
' +
    '/verify - Start verification process
' +
    '/support - Contact support'
  );
});

// Profile command
bot.onText(/\/profile/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    'View and edit your profile in the app:',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Open Profile', web_app: { url: `${WEBAPP_URL}/profile` } }]
        ]
      }
    }
  );
});

// Matches command
bot.onText(/\/matches/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    'Check your matches and messages:',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'View Matches', web_app: { url: `${WEBAPP_URL}/matches` } }]
        ]
      }
    }
  );
});

// Verification command
bot.onText(/\/verify/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Get verified to build trust with other users.

' +
    'Basic Verification: Phone number check
' +
    'Premium Verification: Selfie + ID check',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Start Verification', web_app: { url: `${WEBAPP_URL}/settings` } }]
        ]
      }
    }
  );
});

// Support command
bot.onText(/\/support/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Need help? Contact our support team:

' +
    'Email: support@linkup.app
' +
    'Safety issues: safety@linkup.app

' +
    'For emergencies, use the Safety button in the app.',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Safety Center', web_app: { url: `${WEBAPP_URL}/settings` } }]
        ]
      }
    }
  );
});

// Callback queries
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'profile') {
    bot.sendMessage(chatId, 'Opening your profile...', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Open Profile', web_app: { url: `${WEBAPP_URL}/profile` } }]
        ]
      }
    });
  } else if (data === 'matches') {
    bot.sendMessage(chatId, 'Opening your matches...', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'View Matches', web_app: { url: `${WEBAPP_URL}/matches` } }]
        ]
      }
    });
  }

  bot.answerCallbackQuery(query.id);
});

// Handle new matches notification (to be called from backend)
async function notifyMatch(userTelegramId, matchName) {
  try {
    await bot.sendMessage(
      userTelegramId,
      `You have a new match with ${matchName}!`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Send Message', web_app: { url: `${WEBAPP_URL}/matches` } }]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Failed to notify match:', error);
  }
}

// Handle new message notification
async function notifyMessage(userTelegramId, senderName) {
  try {
    await bot.sendMessage(
      userTelegramId,
      `New message from ${senderName}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Read Message', web_app: { url: `${WEBAPP_URL}/matches` } }]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Failed to notify message:', error);
  }
}

console.log('LinkUp Telegram Bot is running...');

module.exports = { notifyMatch, notifyMessage };
