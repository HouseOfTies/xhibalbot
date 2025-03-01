/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { LanguageCommand } from './lang.service';
import { PlayerService } from '../player/player.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Player,
  PlayerSchema,
} from 'src/database/schemas/player/player.schema';
import {
  Vocation,
  VocationSchema,
} from 'src/database/schemas/vocations/vocations.schema';
import {
  Monster,
  MonsterSchema,
} from 'src/database/schemas/monsters/monsters.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Vocation.name, schema: VocationSchema },
      { name: Monster.name, schema: MonsterSchema },
    ]),
  ],
  controllers: [],
  providers: [PlayerService, LanguageCommand],
  exports: [PlayerService],
})
export class LangModule {}
