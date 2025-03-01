import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { Player, PlayerSchema } from './schemas/player/player.schema';
import { PlayerService } from 'src/Modules/player/player.service';
import { Vocation, VocationSchema } from './schemas/vocations/vocations.schema';
import { Monster, MonsterSchema } from './schemas/monsters/monsters.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Vocation.name, schema: VocationSchema },
      { name: Monster.name, schema: MonsterSchema },
    ]),
  ],
  exports: [MongooseModule],
  providers: [DatabaseService, PlayerService],
})
export class DatabaseModule {}
