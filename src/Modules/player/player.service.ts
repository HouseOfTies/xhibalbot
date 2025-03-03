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

  async endCombat(userId: string): Promise<void> {
    await this.playerModel.updateOne(
      { userId },
      {
        $set: {
          inCombat: false,
          currentMonster: null,
          lastCombatEndedAt: new Date(),
        },
      },
    );
  }

  async updatePlayerHealth(
    userId: string,
    damage: number,
  ): Promise<PlayerDocument | null> {
    const player = await this.findOrCreate(userId);
    player.health = Math.max(0, player.health - damage);
    await player.save();
    return player;
  }

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

    player.experience += amount;

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

  getRequiredExp(level: number): number {
    return level * 100;
  }

  async updateCombatMessageId(
    userId: string,
    messageId: number,
  ): Promise<void> {
    await this.playerModel.updateOne(
      { userId },
      { $set: { combatMessageId: messageId } },
    );
  }

  async regenerateStats(): Promise<void> {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const players = await this.playerModel
      .find({
        lastCombatEndedAt: { $lte: twoMinutesAgo },
        $or: [
          { $expr: { $lt: ['$health', '$healthMax'] } },
          { $expr: { $lt: ['$mana', '$manaMax'] } },
        ],
      })
      .populate('vocation');

    for (const player of players) {
      const vocation = player.vocation as any;

      if (!vocation) continue;

      const newHealth = Math.min(
        player.health + vocation.gainHpAmount,
        player.healthMax,
      );
      const newMana = Math.min(
        player.mana + vocation.gainManaAmount,
        player.manaMax,
      );

      await this.playerModel.updateOne(
        { _id: player._id },
        {
          $set: { health: newHealth, mana: newMana },
        },
      );
    }
  }
}
