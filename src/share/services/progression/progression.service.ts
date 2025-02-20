import { Injectable } from '@nestjs/common';
import { UserService } from 'src/Modules/user/user.service';
import { Context } from 'telegraf';
import { ExperienceService } from '../experience/experience.service';
import { I18nService } from 'src/share/services/i18n/i18n.service';

@Injectable()
export class ProgressionService {
  /* TODO: Fix values response in i18n, it seems like exp: {12} */
  constructor(
    public readonly userService: UserService,
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
    const user = await this.userService.getUser(userId);
    if (!user) return;

    const lang = user.language || 'en';

    user.exp += exp;
    user.goldCoins += gold;
    user.miningExp += miningExp;

    let levelUpMessage = '';
    let miningLevelUpMessage = '';

    const requiredExp = this.experienceService.getRequiredExp(user.level);
    if (user.exp >= requiredExp) {
      user.level += 1;
      user.exp = 0;
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
    if (user.miningExp >= requiredMiningExp) {
      user.miningLevel += 1;
      user.miningExp = 0;
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
    console.log(rewardMessage);
    if (levelUpMessage)
      await ctx.reply(levelUpMessage, { parse_mode: 'Markdown' });
    if (miningLevelUpMessage)
      await ctx.reply(miningLevelUpMessage, { parse_mode: 'Markdown' });
  }
}
