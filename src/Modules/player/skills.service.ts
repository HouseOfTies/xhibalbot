import { Command, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { PlayerService } from './player.service';
import { ExperienceService } from 'src/share/services/experience/experience.service';

@Update()
export class PlayerSkillsService {
  constructor(
    private playerService: PlayerService,
    private experienceService: ExperienceService,
  ) {}

  @Command('skills')
  async onSkillCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();
    const player = await this.playerService.findOrCreate(userId);

    const magRequiredExp = this.experienceService.getRequiredMagicExp(
      player.magLevel,
    );
    const magExpPercentage =
      magRequiredExp > 0
        ? ((player.magLevel / magRequiredExp) * 100).toFixed(1)
        : '0';

    const fistRequiredExp = this.experienceService.getRequiredSkillExp(
      player.skillFistLevel,
    );
    const fistExpPercentage =
      fistRequiredExp > 0
        ? ((player.skillFistExp / fistRequiredExp) * 100).toFixed(1)
        : '0';

    const swordRequiredExp = this.experienceService.getRequiredSkillExp(
      player.skillSwordLevel,
    );
    const swordExpPercentage =
      swordRequiredExp > 0
        ? ((player.skillSwordExp / swordRequiredExp) * 100).toFixed(1)
        : '0';

    const distRequiredExp = this.experienceService.getRequiredSkillExp(
      player.skillDistLevel,
    );
    const distExpPercentage =
      distRequiredExp > 0
        ? ((player.skillDistExp / distRequiredExp) * 100).toFixed(1)
        : '0';

    const shieldingRequiredExp = this.experienceService.getRequiredSkillExp(
      player.skillShieldingLevel,
    );
    const shieldingExpPercentage =
      shieldingRequiredExp > 0
        ? ((player.skillShieldingExp / shieldingRequiredExp) * 100).toFixed(1)
        : '0';

    const miningRequiredExp = this.experienceService.getRequiredMiningExp(
      player.miningLevel,
    );
    const miningExpPercentage =
      miningRequiredExp > 0
        ? ((player.miningExperience / miningRequiredExp) * 100).toFixed(1)
        : '0';

    const skillMessage = `
🎯 **Player Skills** 🎯
🆔 ${player.userId}

⚡ **Speed:** ${player.speed}  
💖 **Stamina:** ${player.stamina}  
🛡 **Blessings:** ${player.blessings}  
🎒 **Capacity:** ${player.cap}  

🪄 **Magic Level:** ${player.magLevel}  
🎖 **Magic exp:** ${player.magLevel} / ${magRequiredExp} (${magExpPercentage}%)

⛏️ **Mining Level:** ${player.miningLevel}
🎖 **Mining EXP:** ${player.miningExperience} / ${miningRequiredExp} (${miningExpPercentage}%)

🥊 **Melee Skills:**
   - 👊 **Fist Fighting:** ${player.skillFistLevel}  
     🎖 **EXP:** ${player.skillFistExp} / ${fistRequiredExp} (${fistExpPercentage}%)

   - 🗡 **Sword Fighting:** ${player.skillSwordLevel}  
     🎖 **EXP:** ${player.skillSwordExp} / ${swordRequiredExp} (${swordExpPercentage}%)

🏹 **Ranged Skills:**
   - 🏹 **Distance Fighting:** ${player.skillDistLevel}  
     🎖 **EXP:** ${player.skillDistExp} / ${distRequiredExp} (${distExpPercentage}%)

🛡 **Defense Skills:**
   - 🛡 **Shielding:** ${player.skillShieldingLevel}  
     🎖 **EXP:** ${player.skillShieldingExp} / ${shieldingRequiredExp} (${shieldingExpPercentage}%)
`;

    ctx.reply(skillMessage, { parse_mode: 'Markdown' });
    return;
  }
}
