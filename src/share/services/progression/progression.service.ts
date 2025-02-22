import { Injectable } from '@nestjs/common';
import { PlayerService } from 'src/Modules/player/player.service';
import { Context } from 'telegraf';
import { ExperienceService } from '../experience/experience.service';
import { I18nService } from 'src/share/services/i18n/i18n.service';

@Injectable()
export class ProgressionService {
  constructor(
    public readonly playerService: PlayerService,
    private readonly experienceService: ExperienceService,
    private readonly i18nService: I18nService,
  ) {}

  async updateProgress(
    userId: string,
    ctx: Context,
    exp: number,
    gold: number,
    miningExp: number,
  ) {
    const user = await this.playerService.getUser(userId);
    if (!user) return;

    const lang = user.language || 'en';

    user.experience += exp;
    user.goldCoins += gold;
    user.miningExperience += miningExp;

    let levelUpMessage = '';
    let miningLevelUpMessage = '';

    const requiredExp = this.experienceService.getRequiredExp(user.level);
    if (user.experience >= requiredExp) {
      user.level += 1;
      user.experience = 0;
      levelUpMessage = this.i18nService.translate(
        lang,
        'commands.progression.levelUp',
        {
          level: user.level,
        },
      );
    }

    const requiredMiningExp = this.experienceService.getRequiredMiningExp(
      user.miningLevel,
    );
    if (user.miningExperience >= requiredMiningExp) {
      user.miningLevel += 1;
      user.miningExperience = 0;
      miningLevelUpMessage = this.i18nService.translate(
        lang,
        'commands.progression.miningLevelUp',
        { miningLevel: user.miningLevel },
      );
    }

    await user.save();

    const rewardMessage = this.i18nService.translate(
      lang,
      'commands.progression.reward',
      {
        exp: exp,
        miningExp: miningExp,
        gold: gold,
      },
    );

    await ctx.reply(rewardMessage, { parse_mode: 'Markdown' });
    if (levelUpMessage)
      await ctx.reply(levelUpMessage, { parse_mode: 'Markdown' });
    if (miningLevelUpMessage)
      await ctx.reply(miningLevelUpMessage, { parse_mode: 'Markdown' });
  }
}
