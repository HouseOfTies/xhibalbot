import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { UserModule } from '../Modules/player/player.module';
import { PlayerService } from '../Modules/player/player.service';
import { sessionMiddleware } from '../middleware/session.middleware';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { RegisterMiddleware } from 'src/middleware/register.middleware';
import { MineModule } from 'src/Modules/mine/mine.module';
import { GreeterModule } from 'src/Modules/greeter/greeter.module';
import { HuntModule } from 'src/Modules/hunt/hunt.module';
import { MonstersModule } from 'src/Modules/monsters/monsters.module';
import { ConvertModule } from 'src/Modules/convert/convert.module';
import { LangModule } from 'src/Modules/lang/lang.module';
import { ShareModule } from 'src/share/share.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    UserModule,
    MineModule,
    GreeterModule,
    UserModule,
    HuntModule,
    MonstersModule,
    ConvertModule,
    LangModule,
    ShareModule,
    DatabaseModule,
    TelegrafModule.forRootAsync({
      botName: 'XhibalbaBot',
      imports: [UserModule],
      inject: [PlayerService],
      useFactory: (playerService: PlayerService) => ({
        token: process.env.TELEGRAM_BOT_TOKEN,
        middlewares: [
          sessionMiddleware,
          LoggerMiddleware,
          RegisterMiddleware(playerService),
        ],
      }),
    }),
  ],
  exports: [TelegrafModule],
})
export class BotModule {}
