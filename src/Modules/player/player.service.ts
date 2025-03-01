import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Player,
  PlayerDocument,
} from 'src/database/schemas/player/player.schema';
import {
  Vocation,
  VocationDocument,
} from 'src/database/schemas/vocations/vocations.schema';
import {
  Monster,
  MonsterDocument,
} from 'src/database/schemas/monsters/monsters.schema';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Vocation.name) private vocationModel: Model<VocationDocument>,
    @InjectModel(Monster.name) private monsterModel: Model<MonsterDocument>,
  ) {}

  /** ✅ Encuentra o crea un jugador nuevo con valores por defecto del Schema **/
  async findOrCreate(userId: string) {
    let player = await this.playerModel.findOne({ userId });

    if (!player) {
      const defaultVocation = await this.vocationModel.findOne({
        vocationId: 0,
      });

      if (!defaultVocation) {
        throw new Error(
          'Default vocation (Normal Human) not found in database.',
        );
      }

      player = new this.playerModel({
        userId,
        vocation: defaultVocation._id, // Solo asignamos vocación, lo demás usa valores por defecto del Schema
      });

      await player.save();
    }

    return player;
  }

  /** ✅ Obtiene un jugador por ID */
  async getUser(userId: string): Promise<PlayerDocument | null> {
    return this.playerModel.findOne({ userId }).exec();
  }

  /** ✅ Actualiza los datos de un jugador */
  async updateUser(
    userId: string,
    updateData: Partial<Player>,
  ): Promise<Player | null> {
    return this.playerModel
      .findOneAndUpdate({ userId }, updateData, { new: true })
      .exec();
  }

  /** ✅ Obtiene un jugador con el nombre de su vocación */
  async getPlayerWithVocationName(userId: string) {
    const player = await this.findOrCreate(userId);
    const vocation = await this.vocationModel
      .findById(player.vocation)
      .select('name');

    return {
      ...player.toObject(),
      vocationName: vocation ? vocation.name : 'Not Defined',
    };
  }

  /** ✅ Permite cambiar el idioma del jugador */
  async updateLanguage(userId: string, language: 'en' | 'es'): Promise<void> {
    await this.playerModel.updateOne({ userId }, { $set: { language } });
  }

  /** ✅ Inicia un combate asignando el monstruo al jugador */
  async startCombat(userId: string, monster: any): Promise<void> {
    const player = await this.getUser(userId);
    if (!player) return;

    await this.playerModel.updateOne(
      { userId },
      {
        $set: {
          inCombat: true,
          currentMonster: {
            monsterId: monster._id,
            name: monster.name,
            maxHealth: monster.maxHealth,
            currentHealth: monster.maxHealth,
            experience: monster.experience,
            attacks: monster.attacks,
          },
        },
      },
    );
  }

  /** ✅ Termina el combate, limpiando la sesión */
  async endCombat(userId: string): Promise<void> {
    await this.playerModel.updateOne(
      { userId },
      {
        $set: {
          inCombat: false,
          currentMonster: null,
        },
      },
    );
  }

  /** ✅ Actualiza la salud del jugador */
  async updatePlayerHealth(
    userId: string,
    damage: number,
  ): Promise<PlayerDocument | null> {
    const player = await this.findOrCreate(userId);
    player.health = Math.max(0, player.health - damage);
    await player.save();
    return player;
  }

  /** ✅ Actualiza la salud del monstruo */
  async updateMonsterHealth(userId: string, damage: number): Promise<any> {
    const player = await this.findOrCreate(userId);
    if (!player.currentMonster) return null;

    player.currentMonster.currentHealth = Math.max(
      0,
      player.currentMonster.currentHealth - damage,
    );

    await player.save();
    return player.currentMonster;
  }

  /** ✅ Maneja pérdida de experiencia */
  async loseExp(userId: string, amount: number): Promise<void> {
    const player = await this.getUser(userId);
    if (!player) return;

    const newExp = Math.max(0, player.experience - amount);
    await this.playerModel.updateOne(
      { userId },
      { $set: { experience: newExp } },
    );
  }

  /** ✅ Maneja ganancia de experiencia y subida de nivel */
  async gainExp(userId: string, amount: number): Promise<void> {
    const player = await this.getUser(userId);
    if (!player) return;

    player.experience += amount;

    // Verificar si sube de nivel
    const nextLevelExp = this.getRequiredExp(player.level);
    if (player.experience >= nextLevelExp) {
      player.level += 1;
      player.experience = 0;
      player.healthMax += 10;
      player.manaMax += 5;
      player.health = player.healthMax;
      player.mana = player.manaMax;

      console.log(
        `🎉 El jugador ${player.userId} ha subido a nivel ${player.level}!`,
      );
    }

    await player.save();
  }

  /** ✅ Calcula la experiencia requerida para subir de nivel */
  getRequiredExp(level: number): number {
    return level * 100; // Por ahora, simple fórmula de progresión lineal
  }
}
