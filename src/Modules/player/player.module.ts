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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
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
