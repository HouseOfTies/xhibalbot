import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { UserModule } from '../Modules/user/user.module';
import { UserService } from '../Modules/user/user.service';
import { sessionMiddleware } from '../middleware/session.middleware';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import { RegisterMiddleware } from 'src/middleware/register.middleware';
import { MineModule } from 'src/Modules/Mine/mine.module';
import { GreeterModule } from 'src/Modules/greeter/greeter.module';

@Module({
  imports: [
    UserModule,
    MineModule,
    GreeterModule,
    UserModule,
    TelegrafModule.forRootAsync({
      botName: 'XhibalbaBot',
      imports: [UserModule],
      inject: [UserService],
      useFactory: (userService: UserService) => ({
        token: process.env.TELEGRAM_BOT_TOKEN,
        middlewares: [
          sessionMiddleware,
          LoggerMiddleware,
          RegisterMiddleware(userService),
        ],
      }),
    }),
  ],
  exports: [TelegrafModule],
})
export class BotModule {}
