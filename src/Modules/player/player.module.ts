/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from 'src/database/schemas/player.schema';
import { PlayerProfileCommand } from './player-commands.service';
import { ExperienceService } from 'src/share/services/experience/experience.service';
import { PlayerService } from './player.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  controllers: [],
  providers: [PlayerService, PlayerProfileCommand, ExperienceService],
  exports: [PlayerService],
})
export class UserModule {}
