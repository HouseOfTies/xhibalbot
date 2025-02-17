import { Command, Ctx, Update } from 'nestjs-telegraf';
import { RedisCooldownService } from 'src/cache/rediscooldown.service';
import { I18nService } from 'src/share/services/i18n/i18n.service';
import { Context } from 'telegraf';

@Update()
export class MineCommands {
  constructor(
    private readonly cooldownService: RedisCooldownService,
    private readonly i18nService: I18nService,
  ) {}

  @Command('mine')
  async onMineCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();
    const command = 'mine';
    const cooldownSeconds = 10;

    const lang = ctx.from.language_code || 'en';

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

    setTimeout(async () => {
      await ctx.reply(
        this.i18nService.translate(lang, 'commands.mine.complete'),
      );
    }, 2000);
  }
}
