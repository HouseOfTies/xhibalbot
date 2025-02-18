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
    if (!['gold', 'platinum'].includes(from) || isNaN(Number(amount))) {
      return ctx.reply('❌ Invalid arguments. Use /convert gold 500.');
    }

    const result = await this.userService.convertCoins(
      userId,
      from as 'gold' | 'platinum',
      Number(amount),
    );

    ctx.reply(result);
    console.log(result);
    return;
  }
}
