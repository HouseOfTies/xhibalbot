import { Command, Ctx, Update } from 'nestjs-telegraf';
import { PlayerService } from 'src/Modules/player/player.service';

@Update()
export class ConvertCommand {
  constructor(private readonly playerService: PlayerService) {}

  @Command('convert')
  async onConvertCommand(@Ctx() ctx: any) {
    const userId = ctx.from.id.toString();
    const args = ctx.message.text.split(' ').slice(1);

    if (args.length !== 2) {
      return ctx.reply('❌ Usage: /convert <gold|platinum> <amount>');
    }

    const [from, amount] = args;
    const amountNum = Number(amount);

    if (
      !['gold', 'platinum'].includes(from) ||
      isNaN(amountNum) ||
      amountNum <= 0
    ) {
      return ctx.reply('❌ Invalid arguments. Use /convert gold 500.');
    }

    const player = await this.playerService.getUser(userId);
    if (!player) {
      return ctx.reply('❌ Player not found.');
    }

    let message: string;

    if (from === 'gold') {
      if (player.goldCoins < amountNum) {
        return ctx.reply('❌ Not enough Gold Coins.');
      }
      player.goldCoins -= amountNum;
      player.platinumCoins += Math.floor(amountNum / 100);
      message = `✅ Successfully converted ${amountNum} Gold Coins to ${Math.floor(amountNum / 100)} Platinum Coins.`;
    } else if (from === 'platinum') {
      if (player.platinumCoins < amountNum) {
        return ctx.reply('❌ Not enough Platinum Coins.');
      }
      player.platinumCoins -= amountNum;
      player.crystalCoins += Math.floor(amountNum / 100);
      message = `✅ Successfully converted ${amountNum} Platinum Coins to ${Math.floor(amountNum / 100)} Crystal Coins.`;
    }

    await player.save();
    ctx.reply(message);
    return;
  }
}
