/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { I18nService } from './services/i18n/i18n.service';
import { ExperienceService } from './services/experience/experience.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ExperienceService, I18nService],
  exports: [ExperienceService, I18nService],
})
export class ShareModule {}
