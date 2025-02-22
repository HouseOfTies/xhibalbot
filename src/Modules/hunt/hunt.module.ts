/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { HuntService } from './hunt.service';
import { UserModule } from '../player/player.module';
import { MonstersModule } from '../monsters/monsters.module';
import { ShareModule } from 'src/share/share.module';
import { RedisCooldownModule } from 'src/cache/rediscooldown.module';

@Module({
  imports: [UserModule, MonstersModule, ShareModule, RedisCooldownModule],
  controllers: [],
  providers: [HuntService],
  exports: [HuntService],
})
export class HuntModule {}
