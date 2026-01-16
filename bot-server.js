
const { Telegraf, Markup } = require('telegraf');

// Render автоматически подставит значения из раздела Environment Variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL;

if (!BOT_TOKEN || !APP_URL) {
  console.error('ОШИБКА: Переменные BOT_TOKEN или APP_URL не настроены в Render!');
  process.exit(1); // Остановить запуск, если настроек нет
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply(
    `⚡️ FEELME-BOT АКТИВИРОВАН\n\nТвой автономный биохакинг-трекер готов к работе.`,
    Markup.inlineKeyboard([
      Markup.button.webApp('🧬 ТЕРМИНАЛ FEELME', APP_URL)
    ])
  );
});

// Пытаемся установить кнопку меню, но не крашим сервер при ошибке
async function setupMenu() {
  try {
    await bot.telegram.setChatMenuButton({
      menuButton: {
        type: 'web_app',
        text: 'FeelMe',
        web_app: { url: APP_URL }
      }
    });
    console.log('Кнопка меню успешно установлена');
  } catch (e) {
    console.error('Не удалось установить кнопку меню:', e.description);
  }
}

bot.launch()
  .then(() => {
    console.log('TMA Бот запущен!');
    setupMenu();
  })
  .catch((err) => {
    console.error('Критическая ошибка запуска:', err);
  });

// Простой HTTP сервер, чтобы Render не закрывал соединение (Health Check)
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
});
server.listen(process.env.PORT || 3000);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
