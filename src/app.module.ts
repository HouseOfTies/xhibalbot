import { NlpServiceService } from './share/services/nlp/nlp-service.service';
import { GreeterModule } from './Modules/greeter/greeter.module';
import { ShareModule } from './share/share.module';
import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { sessionMiddleware } from './middleware/session.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GreeterModule,
    ShareModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TelegrafModule.forRootAsync({
      botName: 'XhibalbaBot',
      useFactory: () => ({
        token: process.env.TELEGRAM_BOT_TOKEN,
        middlewares: [sessionMiddleware, LoggerMiddleware],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [NlpServiceService, AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    /* */
  }
}
