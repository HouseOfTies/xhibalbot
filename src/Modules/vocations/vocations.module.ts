/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { VocationSeederService } from './vocations.seeder';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Vocation,
  VocationSchema,
} from 'src/database/schemas/vocations/vocations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vocation.name, schema: VocationSchema },
    ]),
  ],
  controllers: [],
  providers: [VocationSeederService],
  exports: [VocationSeederService],
})
export class VocationsModule {}
