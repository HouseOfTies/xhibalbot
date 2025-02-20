import { Injectable } from '@nestjs/common';
import { UserService } from 'src/Modules/user/user.service';
import { Context } from 'telegraf';
import { ExperienceService } from '../experience/experience.service';

@Injectable()
export class ProgressionService {
  constructor(
    public readonly userService: UserService,
    private readonly experienceService: ExperienceService,
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

    user.exp += exp;
    user.goldCoins += gold;
    user.miningExp += miningExp;

    let levelUpMessage = '';
    let miningLevelUpMessage = '';

    const requiredExp = this.experienceService.getRequiredExp(user.level);
    if (user.exp >= requiredExp) {
      user.level += 1;
      user.exp = 0;
      levelUpMessage = `🎉 ¡Felicidades! Has subido al **Nivel ${user.level}**!`;
    }

    const requiredMiningExp = this.experienceService.getRequiredMiningExp(
      user.miningLevel,
    );
    if (user.miningExp >= requiredMiningExp) {
      user.miningLevel += 1;
      user.miningExp = 0;
      miningLevelUpMessage = `⛏️ ¡Tu nivel de minería ha subido a **${user.miningLevel}**!`;
    }

    await user.save();

    const rewardMessage = `
🎖 **Recompensa obtenida:**
   - ✨ **EXP:** ${exp}
   - ⛏️ **Mining EXP:** ${miningExp}
   - 🪙 **Gold Coins:** ${gold}
    `;

    await ctx.reply(rewardMessage, { parse_mode: 'Markdown' });
    if (levelUpMessage)
      await ctx.reply(levelUpMessage, { parse_mode: 'Markdown' });
    if (miningLevelUpMessage)
      await ctx.reply(miningLevelUpMessage, { parse_mode: 'Markdown' });
  }
}
