import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VOCATIONS } from './vocations-data';
import {
  Vocation,
  VocationDocument,
} from 'src/database/schemas/vocations/vocations.schema';

@Injectable()
export class VocationSeederService implements OnModuleInit {
  private readonly logger = new Logger(VocationSeederService.name);

  constructor(
    @InjectModel(Vocation.name) private vocationModel: Model<VocationDocument>,
  ) {}

  async onModuleInit() {
    await this.seedVocations();
  }

  private async seedVocations() {
    const count = await this.vocationModel.countDocuments();
    if (count === 0) {
      this.logger.log('Seeding Vocations...');
      await this.vocationModel.insertMany(VOCATIONS);
      this.logger.log('Vocations Seeded Successfully!');
    } else {
      this.logger.log('Vocations already exist. Skipping seeding.');
    }
  }
}
