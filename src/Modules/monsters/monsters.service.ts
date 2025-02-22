import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Monster,
  MonsterDocument,
} from 'src/database/schemas/monsters/monsters.schema';
import { MonsterSeeder } from './monsters.seeder';

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

  async findMonsterForLevel(playerLevel: number): Promise<Monster | null> {
    const availableMonsters = await this.monsterModel
      .find({
        'levelRange.min': { $lte: playerLevel }, // Mínimo nivel del monstruo <= nivel del jugador
        'levelRange.max': { $gte: playerLevel }, // Máximo nivel del monstruo >= nivel del jugador
      })
      .exec();

    if (availableMonsters.length === 0) {
      return null; // No hay monstruos en ese rango de nivel
    }

    // Seleccionar un monstruo aleatorio de los disponibles
    return availableMonsters[
      Math.floor(Math.random() * availableMonsters.length)
    ];
  }
}
