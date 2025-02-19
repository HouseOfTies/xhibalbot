import { Command, Ctx, Update } from 'nestjs-telegraf';
import { UserService } from 'src/Modules/user/user.service';

@Update()
export class ConvertCommand {
  constructor(private readonly userService: UserService) {}

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

    const user = await this.userService.getUser(userId);
    if (!user) {
      return ctx.reply('❌ User not found.');
    }

    let message: string;

    if (from === 'gold') {
      if (user.goldCoins < amountNum) {
        return ctx.reply('❌ Not enough Gold Coins.');
      }
      user.goldCoins -= amountNum;
      user.platinumCoins += Math.floor(amountNum / 100);
      message = `✅ Successfully converted ${amountNum} Gold Coins to ${Math.floor(amountNum / 100)} Platinum Coins.`;
    } else if (from === 'platinum') {
      if (user.platinumCoins < amountNum) {
        return ctx.reply('❌ Not enough Platinum Coins.');
      }
      user.platinumCoins -= amountNum;
      user.crystalCoins += Math.floor(amountNum / 100);
      message = `✅ Successfully converted ${amountNum} Platinum Coins to ${Math.floor(amountNum / 100)} Crystal Coins.`;
    }

    await user.save();
    return ctx.reply(message);
  }
}
