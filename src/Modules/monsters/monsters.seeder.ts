import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

    const monsters = [
      {
        name: 'Rat',
        nameDescription: 'a rat',
        race: 'rodent',
        raceId: 1,
        speed: 100,
        experience: 5,
        levelRange: { min: 1, max: 3 },
        maxHealth: 20,
        currentHealth: 20,
        attacks: [{ name: 'bite', interval: 2000, minDamage: 1, maxDamage: 3 }],
        defenses: { armor: 1, defense: 1 },
        elements: [{ type: 'physical', percent: 0 }],
        immunities: [],
        voices: { interval: 5000, chance: 10, sentences: ['Squeak!'] },
        loot_table: [{ itemName: 'cheese', dropChance: 5000 }],
        spawn_zones: ['sewers', 'fields'],
      },
      {
        name: 'Cave Rat',
        nameDescription: 'a cave rat',
        race: 'rodent',
        raceId: 2,
        speed: 110,
        experience: 8,
        levelRange: { min: 2, max: 4 },
        maxHealth: 25,
        currentHealth: 25,
        attacks: [{ name: 'bite', interval: 2000, minDamage: 2, maxDamage: 4 }],
        defenses: { armor: 1, defense: 1 },
        elements: [{ type: 'physical', percent: 0 }],
        immunities: [],
        voices: { interval: 5000, chance: 10, sentences: ['Squeak!'] },
        loot_table: [{ itemName: 'cheese', dropChance: 6000 }],
        spawn_zones: ['caves', 'underground'],
      },
      {
        name: 'Troll',
        nameDescription: 'a troll',
        race: 'humanoid',
        raceId: 3,
        speed: 120,
        experience: 20,
        levelRange: { min: 4, max: 8 },
        maxHealth: 50,
        currentHealth: 50,
        attacks: [
          { name: 'club', interval: 2500, minDamage: 5, maxDamage: 10 },
        ],
        defenses: { armor: 2, defense: 3 },
        elements: [{ type: 'physical', percent: 0 }],
        immunities: [],
        voices: { interval: 5000, chance: 10, sentences: ['Grrrr!'] },
        loot_table: [{ itemName: 'gold coin', countmax: 5, dropChance: 7000 }],
        spawn_zones: ['mountains', 'caves'],
      },
      {
        name: 'Spider',
        nameDescription: 'a spider',
        race: 'insect',
        raceId: 4,
        speed: 150,
        experience: 15,
        levelRange: { min: 3, max: 6 },
        maxHealth: 30,
        currentHealth: 30,
        attacks: [
          {
            name: 'bite',
            interval: 2000,
            minDamage: 3,
            maxDamage: 6,
            poison: 10,
          },
        ],
        defenses: { armor: 1, defense: 2 },
        elements: [{ type: 'poison', percent: 20 }],
        immunities: [],
        voices: { interval: 5000, chance: 10, sentences: ['Hisss!'] },
        loot_table: [{ itemName: 'spider silk', dropChance: 5000 }],
        spawn_zones: ['forests', 'caves'],
      },
      {
        name: 'Rotworm',
        nameDescription: 'a rotworm',
        race: 'worm',
        raceId: 5,
        speed: 90,
        experience: 30,
        levelRange: { min: 5, max: 10 },
        maxHealth: 80,
        currentHealth: 80,
        attacks: [
          { name: 'bite', interval: 2500, minDamage: 6, maxDamage: 12 },
        ],
        defenses: { armor: 3, defense: 4 },
        elements: [{ type: 'earth', percent: 10 }],
        immunities: [],
        voices: { interval: 5000, chance: 10, sentences: ['Slurp!'] },
        loot_table: [{ itemName: 'gold coin', countmax: 10, dropChance: 8000 }],
        spawn_zones: ['underground', 'caves'],
      },
    ];

    await this.monsterModel.insertMany(monsters);
    this.logger.log('Monsters seeded successfully!');
  }
}
