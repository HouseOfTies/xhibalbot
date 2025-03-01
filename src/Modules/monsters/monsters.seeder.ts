import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MONSTERS } from 'src/database/data/monsters-data';
import {
  Monster,
  MonsterDocument,
} from 'src/database/schemas/monsters/monsters.schema';

@Injectable()
export class MonsterSeeder {
  private readonly logger = new Logger(MonsterSeeder.name);

  constructor(
    @InjectModel(Monster.name) private monsterModel: Model<MonsterDocument>,
  ) {}

  async seed() {
    const count = await this.monsterModel.countDocuments();
    if (count > 0) {
      this.logger.log('Monsters already exist. Skipping seeding...');
      return;
    }

    this.logger.log('Seeding monsters...');

    await this.monsterModel.insertMany(MONSTERS);
    this.logger.log('Monsters seeded successfully!');
  }
}
