import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Monster,
  MonsterDocument,
} from 'src/database/schemas/monsters/monsters.schema';
import { MonsterSeeder } from './monsters.seeder';
interface MonsterWithLevel extends Monster {
  generatedLevel: number;
}

@Injectable()
export class MonsterService implements OnModuleInit {
  private readonly logger = new Logger(MonsterService.name);

  constructor(
    @InjectModel(Monster.name) private monsterModel: Model<MonsterDocument>,
    private readonly monsterSeeder: MonsterSeeder,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing MonsterService...');
    await this.monsterSeeder.seed();
  }

  async findAll(): Promise<Monster[]> {
    return this.monsterModel.find().exec();
  }

  async findById(id: string): Promise<Monster> {
    return this.monsterModel.findById(id).exec();
  }

  async findMonsterForLevel(
    playerLevel: number,
  ): Promise<MonsterWithLevel | null> {
    const availableMonsters = await this.monsterModel
      .find({
        'levelRange.min': { $lte: playerLevel },
        'levelRange.max': { $gte: playerLevel },
      })
      .exec();

    if (availableMonsters.length === 0) {
      return null;
    }

    const monster =
      availableMonsters[Math.floor(Math.random() * availableMonsters.length)];

    const generatedLevel =
      Math.floor(
        Math.random() * (monster.levelRange.max - monster.levelRange.min + 1),
      ) + monster.levelRange.min;

    return Object.assign(monster.toObject(), {
      generatedLevel,
    }) as MonsterWithLevel;
  }
}
