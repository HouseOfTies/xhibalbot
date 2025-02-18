import { UserModule } from './Modules/user/user.module';
import { I18nService } from './share/services/i18n/i18n.service';
import { MineModule } from './Modules/Mine/mine.module';
import { RedisCooldownModule } from './cache/rediscooldown.module';
import { GreeterModule } from './Modules/greeter/greeter.module';
import { ShareModule } from './share/share.module';
import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    MineModule,
    GreeterModule,
    UserModule,
    ShareModule,
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    BotModule,
    RedisCooldownModule,
  ],
  controllers: [AppController],
  providers: [I18nService, AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    /* */
  }
  /* configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanguageMiddleware).forRoutes('*');
  } */
}
