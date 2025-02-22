import { Command, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PlayerService } from './player.service';
import { ExperienceService } from 'src/share/services/experience/experience.service';

@Update()
export class PlayerProfileCommand {
  constructor(
    private playerService: PlayerService,
    private experienceService: ExperienceService,
  ) {}

  @Command('profile')
  async onProfileCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();

    const player = await this.playerService.findOrCreate(userId);

    const requiredExp = this.experienceService.getRequiredExp(player.level);
    const expPercentage =
      requiredExp > 0
        ? ((player.experience / requiredExp) * 100).toFixed(1)
        : '0';

    const profileMessage = `
⚜️ **Player Profile** ⚜️
🆔 ${player.userId}

❤️ **HP:** ${player.health} / 100  
💧 **Mana:** ${player.mana} / 100
✨ **Synergy Mana:** ${player.synergyMana}  

⭐ **Level:** ${player.level}  
🎖 **EXP:** ${player.experience} / ${requiredExp} (${expPercentage}%)

💰 **Money:**
   - 🪙 **Gold Coins:** ${player.goldCoins}  
   - 💵 **Platinum Coins:** ${player.platinumCoins}  
   - 💎 **Crystal Coins:** ${player.crystalCoins}  

⚔ **Vocation:** ${player.vocationId || 'Not Defined'}  

🌎 **Language:** ${player.language.toUpperCase()}  
`;

    ctx.reply(profileMessage, { parse_mode: 'Markdown' });
    return;
  }
}
