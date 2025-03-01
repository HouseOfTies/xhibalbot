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

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Vocation.name) private vocationModel: Model<VocationDocument>,
  ) {}

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
        vocation: defaultVocation._id,
      });

      await player.save();
    }

    return player;
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

  async updateLanguage(userId: string, language: 'en' | 'es'): Promise<void> {
    await this.playerModel.updateOne({ userId }, { $set: { language } });
  }

  async startCombat(userId: string, monster: any): Promise<void> {
    const player = await this.getUser(userId);
    const currentHealth = player ? player.health : 100;
    await this.playerModel.updateOne(
      { userId },
      {
        $set: {
          inCombat: true,
          currentMonster: monster._id,
          health: Math.max(1, currentHealth),
        },
      },
    );
  }

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

  async updatePlayerHealth(userId: string, newHealth: number): Promise<void> {
    await this.playerModel.updateOne(
      { userId },
      { $set: { health: newHealth } },
    );
  }

  async loseExp(userId: string, amount: number): Promise<void> {
    const player = await this.getUser(userId);
    if (!player) return;

    const newExp = Math.max(0, player.experience - amount);
    await this.playerModel.updateOne(
      { userId },
      { $set: { experience: newExp } },
    );
  }

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
