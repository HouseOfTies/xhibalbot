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
  async getUser(userId: string): Promise<User | null> {
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
}
