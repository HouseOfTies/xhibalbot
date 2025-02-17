// mine.command.ts
import { Command, Ctx, Update } from 'nestjs-telegraf';
import { RedisCooldownService } from 'src/cache/rediscooldown.service';
import { Context } from 'telegraf';

@Update()
export class MineCommands {
  constructor(private readonly cooldownService: RedisCooldownService) {}

  @Command('mine')
  async onMineCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();
    const command = 'mine';
    const cooldownSeconds = 10;

    const cooldownCheck = await this.cooldownService.checkCooldown(
      userId,
      command,
      cooldownSeconds,
    );

    if (!cooldownCheck.allowed) {
      return ctx.reply(
        `Command on cooldown. Please wait ${cooldownCheck.timeRemaining} seconds before using this command again.`,
      );
    }

    // Your mine command logic here
    await ctx.reply(
      'Mining started! You will receive resources in a moment...',
    );

    // Simulate some mining process
    setTimeout(async () => {
      await ctx.reply('Mining complete! You received 10 resources.');
    }, 2000);
  }
}
