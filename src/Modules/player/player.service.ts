import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Player,
  PlayerDocument,
} from 'src/database/schemas/player/player.schema';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
  ) {}

  async findOrCreate(userId: string): Promise<Player> {
    let user = await this.playerModel.findOne({ userId });

    if (!user) {
      user = new this.playerModel({
        userId,
      });
      await user.save();
    }

    return user;
  }

  async getUser(userId: string): Promise<PlayerDocument | null> {
    return this.playerModel.findOne({ userId }).exec();
  }

  async updateUser(
    userId: string,
    updateData: Partial<Player>,
  ): Promise<Player | null> {
    return this.playerModel
      .findOneAndUpdate({ userId }, updateData, { new: true })
      .exec();
  }

  async updateLanguage(userId: string, language: 'en' | 'es'): Promise<void> {
    await this.playerModel.updateOne({ userId }, { $set: { language } });
  }

  // ✅ Iniciar combate, guardando el monstruo actual
  async startCombat(userId: string, monster: any): Promise<void> {
    const player = await this.getUser(userId);
    const currentHealth = player ? player.health : 100; // Si no hay player, usa 100 de vida por defecto
    await this.playerModel.updateOne(
      { userId },
      {
        $set: {
          inCombat: true,
          currentMonster: monster._id,
          health: Math.max(1, currentHealth), // Evita que el jugador inicie el combate con 0 de vida
        },
      },
    );
  }

  // ✅ Terminar combate y limpiar estado
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

  // ✅ Actualizar la vida del jugador
  async updatePlayerHealth(userId: string, newHealth: number): Promise<void> {
    await this.playerModel.updateOne(
      { userId },
      { $set: { health: newHealth } },
    );
  }

  // ✅ Restar experiencia si el jugador muere
  async loseExp(userId: string, amount: number): Promise<void> {
    const player = await this.getUser(userId);
    if (!player) return;

    const newExp = Math.max(0, player.experience - amount); // No puede bajar de 0
    await this.playerModel.updateOne(
      { userId },
      { $set: { experience: newExp } },
    );
  }

  // ✅ Sumar experiencia si el jugador gana
  async gainExp(userId: string, amount: number): Promise<void> {
    const player = await this.getUser(userId);
    if (!player) return;

    const newExp = player.experience + amount;
    await this.playerModel.updateOne(
      { userId },
      { $set: { experience: newExp } },
    );
  }
}
