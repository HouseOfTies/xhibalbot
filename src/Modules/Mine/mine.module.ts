/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MineCommands } from './mine.service';
import { RedisCooldownModule } from 'src/cache/rediscooldown.module';
import { I18nService } from 'src/share/services/i18n/i18n.service';

@Module({
  imports: [RedisCooldownModule],
  controllers: [],
  exports: [MineCommands],
  providers: [MineCommands, I18nService],
})
export class MineModule {}
