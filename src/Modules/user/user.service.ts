import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOrCreate(userId: string): Promise<User> {
    let user = await this.userModel.findOne({ userId });

    if (!user) {
      user = new this.userModel({
        userId,
      });
      await user.save();
    }

    return user;
  }
  async getUser(userId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ userId }).exec();
  }

  async updateUser(
    userId: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ userId }, updateData, { new: true })
      .exec();
  }

  async updateLanguage(userId: string, language: 'en' | 'es'): Promise<void> {
    await this.userModel.updateOne({ userId }, { $set: { language } });
  }

  async convertCoins(
    userId: string,
    from: 'gold' | 'platinum',
    amount: number,
  ): Promise<string> {
    const user = await this.getUser(userId);
    if (!user) return '❌ User not found.';

    if (from === 'gold') {
      if (user.goldCoins < amount) return '❌ Not enough Gold Coins.';
      user.goldCoins -= amount;
      user.platinumCoins += Math.floor(amount / 100);
    } else if (from === 'platinum') {
      if (user.platinumCoins < amount) return '❌ Not enough Platinum Coins.';
      user.platinumCoins -= amount;
      user.crystalCoins += Math.floor(amount / 100);
    }

    await user.save();
    return;
  }
}
