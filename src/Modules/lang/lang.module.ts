/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { LanguageCommand } from './lang.service';
import { UserService } from '../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [UserService, LanguageCommand],
  exports: [UserService],
})
export class LangModule {}
