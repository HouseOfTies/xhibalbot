/* import { Start, Update, Sender, Command } from 'nestjs-telegraf';
import { UpdateType } from 'src/common/decorators/update-type.decorator';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types'; */

import { Command, Ctx, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { UserService } from './user.service';

@Update()
export class UserProfileCommand {
  constructor(private userService: UserService) {}

  @Command('profile')
  async onProfileCommand(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();

    const user = await this.userService.findOrCreate(userId);

    const profileMessage = `
⚜️ **Player Profile** ⚜️
🆔 ${user.userId}

❤️ **HP:** ${user.hp} / 100  
💧 **Mana:** ${user.mana} / 100

⭐ **Level:** ${user.level}  
🎖 **EXP:** ${user.exp}  

💰 **Money:**
   - 🪙 **Gold Coins:** ${user.goldCoins}  
   - 💵 **Platinum Coins:** ${user.platinumCoins}  
   - 💎 **Crystal Coins:** ${user.crystalCoins}  

⚔ **Vocation:** ${user.vocation || 'Not Defined'}  

🌎 **Language:** ${user.language.toUpperCase()}  
`;

    ctx.reply(profileMessage, { parse_mode: 'Markdown' });
    return;
  }
}
