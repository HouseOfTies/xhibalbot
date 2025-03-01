/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Player,
  PlayerSchema,
} from 'src/database/schemas/player/player.schema';
import { PlayerProfileCommand } from './player-commands.service';
import { ExperienceService } from 'src/share/services/experience/experience.service';
import { PlayerService } from './player.service';
import { PlayerSkillsService } from './skills.service';
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
  providers: [
    PlayerService,
    PlayerProfileCommand,
    ExperienceService,
    PlayerSkillsService,
  ],
  exports: [PlayerService],
})
export class UserModule {}
