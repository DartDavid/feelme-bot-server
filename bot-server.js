
const { Telegraf, Markup } = require('telegraf');

// Замените на ваши данные
const BOT_TOKEN = 'ВАШ_ТОКЕН_ОТ_BOTFATHER';
const APP_URL = 'https://your-deployed-app-url.com'; 

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply(
    `⚡️ FEELME-BOT АКТИВИРОВАН\n\nТвой автономный биохакинг-трекер готов к работе. Нажимай кнопку ниже, чтобы войти в терминал.`,
    Markup.inlineKeyboard([
      Markup.button.webApp('🧬 ТЕРМИНАЛ FEELME', APP_URL)
    ])
  );
});

// Настройка кнопки меню в интерфейсе Telegram
bot.telegram.setChatMenuButton({
  menuButton: {
    type: 'web_app',
    text: 'FeelMe',
    web_app: { url: APP_URL }
  }
});

bot.launch().then(() => console.log('TMA Бот запущен!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
