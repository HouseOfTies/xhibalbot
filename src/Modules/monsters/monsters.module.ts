import { MongooseModule } from '@nestjs/mongoose';
import { MonsterService } from './monsters.service';
import { Module } from '@nestjs/common';
import { MonsterSeeder } from './monsters.seeder';
import {
  Monster,
  MonsterSchema,
} from 'src/database/schemas/monsters/monsters.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Monster.name, schema: MonsterSchema }]),
  ],
  providers: [MonsterService, MonsterSeeder],
  exports: [MonsterService],
})
export class MonstersModule {}
