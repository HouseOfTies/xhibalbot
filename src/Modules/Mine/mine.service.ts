import { Command, Ctx, Update } from 'nestjs-telegraf';
import { RedisCooldownService } from 'src/cache/rediscooldown.service';
import { I18nService } from 'src/share/services/i18n/i18n.service';
import { Context } from 'telegraf';
import { UserService } from '../user/user.service';
import { ExperienceService } from 'src/share/services/experience/experience.service';

@Update()
export class MineCommands {
  constructor(
    private readonly cooldownService: RedisCooldownService,
    private readonly i18nService: I18nService,
    private readonly userService: UserService,
    private readonly experienceService: ExperienceService,
  ) {}

  @Command('mine')
  async onMineCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();
    const command = 'mine';
    const user = await this.userService.getUser(userId);
    const baseCooldown = 60;
    const cooldownSeconds = baseCooldown + (user.level - 1) * 5;

    const lang = user?.language || 'en';

    const cooldownCheck = await this.cooldownService.checkCooldown(
      userId,
      command,
      cooldownSeconds,
    );

    if (!cooldownCheck.allowed) {
      ctx.reply(
        this.i18nService.translate(lang, 'commands.mine.cooldown', {
          time: cooldownCheck.timeRemaining || 0,
        }),
      );

      return;
    }

    await ctx.reply(this.i18nService.translate(lang, 'commands.mine.start'));

    const goldEarned = Math.floor(Math.random() * 10) + 5 + user.miningLevel;
    const expEarned = Math.floor(Math.random() * 15) + 10 + user.miningLevel;

    user.goldCoins += goldEarned;
    user.exp += expEarned;
    user.miningLevel += 1;
    await user.save();

    const requiredExp = this.experienceService.getRequiredExp(user.level);
    if (user.exp >= requiredExp) {
      user.level += 1;
      user.exp = 0;
      await user.save();

      await ctx.reply(
        this.i18nService.translate(lang, 'commands.mine.levelUp', {
          level: user.level,
        }),
      );
    }

    const lootMessage = this.i18nService.translate(lang, 'commands.mine.loot', {
      gold: goldEarned,
      exp: expEarned,
    });

    await ctx.reply(
      this.i18nService.translate(lang, 'commands.mine.complete', {
        loot: lootMessage,
      }),
    );

    await ctx.reply(
      this.i18nService.translate(lang, 'commands.mine.cooldown', {
        time: cooldownSeconds,
      }),
    );
  }
}
