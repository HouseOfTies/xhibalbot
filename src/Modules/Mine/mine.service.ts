import { Command, Ctx, Update } from 'nestjs-telegraf';
import { RedisCooldownService } from 'src/cache/rediscooldown.service';
import { I18nService } from 'src/share/services/i18n/i18n.service';
import { Context } from 'telegraf';
import { ProgressionService } from 'src/share/services/progression/progression.service';

@Update()
export class MineCommands {
  private readonly BASE_COOLDOWN = 60;
  private readonly GOLD_MIN = 5;
  private readonly GOLD_MAX = 10;
  private readonly EXP_MIN = 10;
  private readonly EXP_MAX = 15;

  constructor(
    private readonly cooldownService: RedisCooldownService,
    private readonly i18nService: I18nService,
    private readonly progressionService: ProgressionService, // ✅ Usamos ProgressionService
  ) {}

  @Command('mine')
  async onMineCommand(@Ctx() ctx: Context) {
    /* TODO: Arreglar el progressionService */
    const userId = ctx.from.id.toString();
    const user = await this.progressionService.userService.getUser(userId);
    if (!user) return;

    const lang = user.language || 'en';
    const cooldownSeconds = this.calculateCooldown(user.level);

    if (!(await this.checkCooldown(ctx, userId, cooldownSeconds, lang))) return;

    await this.startMining(ctx, lang);
    await this.processMiningResults(ctx, user, lang);
    await this.notifyCooldown(ctx, lang, cooldownSeconds);
  }

  private calculateCooldown(level: number): number {
    return this.BASE_COOLDOWN + (level - 1) * 5;
  }

  private async checkCooldown(
    ctx: Context,
    userId: string,
    cooldown: number,
    lang: string,
  ): Promise<boolean> {
    const cooldownCheck = await this.cooldownService.checkCooldown(
      userId,
      'mine',
      cooldown,
    );

    if (!cooldownCheck.allowed) {
      await ctx.reply(
        this.i18nService.translate(lang, 'commands.mine.cooldown', {
          time: cooldownCheck.timeRemaining || 0,
        }),
      );
      return false;
    }
    return true;
  }

  private async startMining(ctx: Context, lang: string): Promise<void> {
    await ctx.reply(this.i18nService.translate(lang, 'commands.mine.start'));
  }

  private async processMiningResults(
    ctx: Context,
    user: any,
    lang: string,
  ): Promise<void> {
    const goldEarned = this.calculateEarnings(
      user.miningLevel,
      this.GOLD_MIN,
      this.GOLD_MAX,
    );
    const expEarned = this.calculateEarnings(
      user.miningLevel,
      this.EXP_MIN,
      this.EXP_MAX,
    );

    await this.progressionService.updateProgress(
      user.userId,
      ctx,
      expEarned,
      goldEarned,
    );

    const lootMessage = this.i18nService.translate(lang, 'commands.mine.loot', {
      gold: goldEarned,
      exp: expEarned,
    });

    await ctx.reply(
      this.i18nService.translate(lang, 'commands.mine.complete', {
        loot: lootMessage,
      }),
    );
  }

  private calculateEarnings(level: number, min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min + level;
  }

  private async notifyCooldown(
    ctx: Context,
    lang: string,
    cooldownSeconds: number,
  ): Promise<void> {
    await ctx.reply(
      this.i18nService.translate(lang, 'commands.mine.cooldown', {
        time: cooldownSeconds,
      }),
    );
  }
}
