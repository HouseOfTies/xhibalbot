/* import { Start, Update, Sender, Command } from 'nestjs-telegraf';
import { UpdateType } from 'src/common/decorators/update-type.decorator';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types'; */

import { Command, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { UserService } from './user.service';
import { ExperienceService } from 'src/share/services/experience/experience.service';

@Update()
export class UserProfileCommand {
  constructor(
    private userService: UserService,
    private experienceService: ExperienceService,
  ) {}

  @Command('profile')
  async onProfileCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();

    const user = await this.userService.findOrCreate(userId);

    const requiredExp = this.experienceService.getRequiredExp(user.level);
    const expPercentage =
      requiredExp > 0 ? ((user.exp / requiredExp) * 100).toFixed(1) : '0';

    const miningRequiredExp = this.experienceService.getRequiredMiningExp(
      user.miningLevel,
    );
    const miningExpPercentage =
      miningRequiredExp > 0
        ? ((user.miningExp / miningRequiredExp) * 100).toFixed(1)
        : '0';

    const profileMessage = `
⚜️ **Player Profile** ⚜️
🆔 ${user.userId}

❤️ **HP:** ${user.health} / 100  
💧 **Mana:** ${user.mana} / 100

⭐ **Level:** ${user.level}  
🎖 **EXP:** ${user.exp} / ${requiredExp} (${expPercentage}%)

⛏️ **Mining Level:** ${user.miningLevel}
🎖 **Mining EXP:** ${user.miningExp} / ${miningRequiredExp} (${miningExpPercentage}%)

💰 **Money:**
   - 🪙 **Gold Coins:** ${user.goldCoins}  
   - 💵 **Platinum Coins:** ${user.platinumCoins}  
   - 💎 **Crystal Coins:** ${user.crystalCoins}  

⚔ **Vocation:** ${user.vocation || 'Not Defined'}  

🌎 **Language:** ${user.language.toUpperCase()}  
`;

    ctx.reply(profileMessage, { parse_mode: 'Markdown' });
    return;
  }
}
