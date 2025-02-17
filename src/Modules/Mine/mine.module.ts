/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MineCommands } from './mine.service';
import { RedisCooldownModule } from 'src/cache/rediscooldown.module';

@Module({
  imports: [RedisCooldownModule],
  controllers: [],
  exports: [MineCommands],
  providers: [MineCommands],
})
export class MineModule {}
