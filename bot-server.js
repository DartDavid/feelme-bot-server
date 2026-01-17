
const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const path = require('path');

const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.APP_URL;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN || !APP_URL) {
  console.error('CRITICAL: BOT_TOKEN or APP_URL is not set!');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const app = express();

// Раздача статических файлов (фронтенда)
app.use(express.static(path.join(__dirname, './')));

// Кнопка открытия приложения
const webAppBtn = Markup.inlineKeyboard([
  Markup.button.webApp('🧬 ОТКРЫТЬ ТЕРМИНАЛ', APP_URL)
]);

// Команды бота
bot.start((ctx) => ctx.reply(`🚀 FEELME-BOT АКТИВИРОВАН\n\nТвой автономный биохакинг-терминал готов.\n\n/zones — Цветовые зоны\n/principles — Принципы\n/params — Параметры\n/buffs — Усиления\n/debuffs — Ослабления`, webAppBtn));

bot.command('zones', (ctx) => ctx.reply(`📊 ЦВЕТОВЫЕ ЗОНЫ:\n🟢 ЗЕЛЕНЫЙ (6-10): Пик.\n🟡 ЖЕЛТЫЙ (4-5): Экономия.\n🔴 КРАСНЫЙ (1-3): Стоп.`, webAppBtn));
bot.command('principles', (ctx) => ctx.reply(`🛡 ПРИНЦИПЫ:\n1. Сон — база.\n2. Дебаффы — откат на 2 дня.\n3. Напор — главный ресурс.`, webAppBtn));
bot.command('params', (ctx) => ctx.reply(`🧬 ПАРАМЕТРЫ:\n❤️ Здоровье, 🎭 Настроение, 🧠 Интеллект, ⚡ Энергия, 🎯 Напор.`, webAppBtn));
bot.command('buffs', (ctx) => ctx.reply(`⚡️ УСИЛЕНИЯ:\n😴 Сон, 💪 Тренировка, 🧊 Душ, 🧘 Воздержание.`, webAppBtn));
bot.command('debuffs', (ctx) => ctx.reply(`⚠️ ОСЛАБЛЕНИЯ:\n🍺 Алкоголь, 🌿 Марихуана, 🔞 Мастурбация, 🥱 Недосып.`, webAppBtn));

// Обработка ошибок бота
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Запуск бота
bot.launch().then(() => {
  console.log('--- BOT STARTED ---');
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Запустить терминал' },
    { command: 'zones', description: 'Зоны состояния' },
    { command: 'buffs', description: 'Усиления' },
    { command: 'debuffs', description: 'Ослабления' }
  ]);
}).catch(err => {
  console.error('Launch error:', err);
});

// Запуск веб-сервера (для Render и Vercel Health Check)
app.listen(PORT, () => {
  console.log(`--- SERVER RUNNING ON PORT ${PORT} ---`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
