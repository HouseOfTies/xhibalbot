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
  ) {
    const user = await this.userService.getUser(userId);
    if (!user) return;

    user.exp += exp;
    user.goldCoins += gold;

    const requiredExp = this.experienceService.getRequiredExp(user.level);
    let levelUpMessage = '';

    if (user.exp >= requiredExp) {
      user.level += 1;
      user.exp = 0;
      user.miningLevel += 1;
      levelUpMessage = `🎉 ¡Felicidades! Has subido al **Nivel ${user.level}**!`;
    }

    await user.save();

    const rewardMessage = `
🎖 **Recompensa obtenida:**
   - ✨ **EXP:** ${exp}
   - 🪙 **Gold Coins:** ${gold}
    `;

    await ctx.reply(rewardMessage);
    if (levelUpMessage) {
      await ctx.reply(levelUpMessage);
    }
  }
}
