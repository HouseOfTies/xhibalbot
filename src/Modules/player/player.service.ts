import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from 'src/database/schemas/player/player.schema';

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
}
