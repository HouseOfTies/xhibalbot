import { Command, Ctx, Update } from 'nestjs-telegraf';
import { RedisCooldownService } from 'src/cache/rediscooldown.service';
import { I18nService } from 'src/share/services/i18n/i18n.service';
import { Context } from 'telegraf';
import { UserService } from '../user/user.service';

@Update()
export class MineCommands {
  constructor(
    private readonly cooldownService: RedisCooldownService,
    private readonly i18nService: I18nService,
    private readonly userService: UserService,
  ) {}

  @Command('mine')
  async onMineCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();
    const command = 'mine';
    const cooldownSeconds = 60;

    const user = await this.userService.getUser(userId);
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

    const goldEarned = Math.floor(Math.random() * 20) + 5;
    user.goldCoins += goldEarned;
    await user.save();

    const lootMessage = this.i18nService.translate(lang, 'commands.mine.loot', {
      gold: goldEarned,
    });

    await ctx.reply(
      this.i18nService.translate(lang, 'commands.mine.complete', {
        loot: lootMessage,
      }),
    );
  }
}
