/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { I18nService } from './services/i18n/i18n.service';
import { ExperienceService } from './services/experience/experience.service';
import { ProgressionService } from './services/progression/progression.service';
import { UserModule } from 'src/Modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [ExperienceService, I18nService, ProgressionService],
  exports: [ExperienceService, I18nService, ProgressionService],
})
export class ShareModule {}
