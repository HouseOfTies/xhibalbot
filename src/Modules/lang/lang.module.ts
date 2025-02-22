/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { LanguageCommand } from './lang.service';
import { PlayerService } from '../player/player.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from 'src/database/schemas/player/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  controllers: [],
  providers: [PlayerService, LanguageCommand],
  exports: [PlayerService],
})
export class LangModule {}
