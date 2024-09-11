import { registerAs } from '@nestjs/config';
import { BotConfig } from 'src/share/interface/config.interface';

export default registerAs(
  'bot',
  (): BotConfig => ({
    token: process.env.TELEGRAM_BOT_TOKEN,
  }),
);
