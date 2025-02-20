import { UserModule } from '../player/player.module';
import { ConvertCommand } from './convert.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [ConvertCommand],
  exports: [ConvertCommand],
})
export class ConvertModule {}
