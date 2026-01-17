
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL;

if (!BOT_TOKEN || !APP_URL) {
  console.error('CRITICAL: BOT_TOKEN or APP_URL is not set!');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Универсальная кнопка для возврата в приложение
const webAppBtn = Markup.inlineKeyboard([
  Markup.button.webApp('🧬 ОТКРЫТЬ ТЕРМИНАЛ', APP_URL)
]);

// --- START COMMAND ---
bot.start((ctx) => {
  return ctx.reply(
    `🚀 FEELME-BOT АКТИВИРОВАН\n\nТвой автономный биохакинг-терминал готов к работе.\n\n📚 БАЗА ЗНАНИЙ:\n/zones — Цветовые зоны\n/principles — Принципы\n/params — Параметры тела\n/buffs — Усиления\n/debuffs — Ослабления\n\nИспользуй меню слева или нажми кнопку ниже:`,
    webAppBtn
  );
});

// --- BASE COMMANDS ---
bot.command('zones', (ctx) => {
  ctx.reply(`📊 ЦВЕТОВЫЕ ЗОНЫ СОСТОЯНИЯ:\n\n🟢 ЗЕЛЕНЫЙ (6-10): Пик формы. Время для амбициозных задач.\n\n🟡 ЖЕЛТЫЙ (4-5): Энергосбережение. Фокус на восстановлении.\n\n🔴 КРАСНЫЙ (1-3): Стоп-режим. Только еда и сон.`, webAppBtn);
});

bot.command('principles', (ctx) => {
  ctx.reply(`🛡 ПРИНЦИПЫ МЕТОДОЛОГИИ:\n\n1. Сон — база всех параметров.\n2. Дебаффы отнимают 2 дня прогресса.\n3. Напор (Drive) — твой главный ресурс.`, webAppBtn);
});

bot.command('params', (ctx) => {
  ctx.reply(`🧬 ПАРАМЕТРЫ ТЕЛА:\n\n❤️ Здоровье: Ресурс органов и систем.\n🎭 Настроение: Дофаминовый фон.\n🧠 Интеллект: Когнитивная ясность.\n⚡ Энергия: Емкость батарейки.\n🎯 Напор: Либидо и воля.`, webAppBtn);
});

bot.command('buffs', (ctx) => {
  ctx.reply(`⚡️ СПИСОК УСИЛЕНИЙ:\n\n😴 Сон: Восстановление Intellect/Energy.\n💪 Тренировка: Буст Drive на 48ч.\n🧊 Холодный душ: Ресет Mood/Intellect.\n🧘 Воздержание: Накопление Drive.`, webAppBtn);
});

bot.command('debuffs', (ctx) => {
  ctx.reply(`⚠️ СПИСОК ОСЛАБЛЕНИЙ:\n\n🍺 Алкоголь: Убивает сон на 36ч.\n🌿 Марихуана: Сливает Intellect на 48ч.\n🔞 Мастурбация: Резкий обвал Drive.\n🥱 Недосып: Деградация всех систем.`, webAppBtn);
});

bot.help((ctx) => ctx.reply(`Доступные команды:\n/zones\n/principles\n/params\n/buffs\n/debuffs`, webAppBtn));

// --- LAUNCH WITH ERROR HANDLING ---
bot.launch()
  .then(() => {
    console.log('--- FEELME BOT STARTED SUCCESSFULLY ---');
    // Явная регистрация команд в меню Telegram
    bot.telegram.setMyCommands([
      { command: 'start', description: 'Запустить терминал' },
      { command: 'zones', description: 'Цветовые зоны' },
      { command: 'principles', description: 'Принципы системы' },
      { command: 'params', description: 'Параметры тела' },
      { command: 'buffs', description: 'Список усилений' },
      { command: 'debuffs', description: 'Список ослаблений' },
      { command: 'help', description: 'Помощь' }
    ]).catch(err => console.error('Error setting commands:', err));
  })
  .catch((err) => {
    if (err.description && err.description.includes('Conflict')) {
      console.error('--- ERROR 409: CONFLICT ---');
      console.error('Выключите все другие копии бота!');
      process.exit(1);
    } else {
      console.error('Критическая ошибка запуска:', err);
      process.exit(1);
    }
  });

// Health check for Render
const http = require('http');
http.createServer((req, res) => { 
  res.writeHead(200); 
  res.end('Bot is running'); 
}).listen(process.env.PORT || 3000);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
