/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { UserProfileCommand } from './user-commands.service';
import { ExperienceService } from 'src/share/services/experience/experience.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [UserService, UserProfileCommand, ExperienceService],
  exports: [UserService],
})
export class UserModule {}
