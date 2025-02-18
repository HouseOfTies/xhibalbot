import { Command, Ctx, Update, Action } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Markup } from 'telegraf';
import { UserService } from '../user/user.service';

@Update()
export class LanguageCommand {
  constructor(private readonly userService: UserService) {}

  @Command('lang')
  async onLangCommand(@Ctx() ctx: Context) {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('🇺🇸 English', 'set_lang_en')],
      [Markup.button.callback('🇪🇸 Español', 'set_lang_es')],
    ]);

    ctx.reply('🌍 Select your language:', keyboard);
    return;
  }

  @Action('set_lang_en')
  async setEnglish(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();
    await this.userService.updateLanguage(userId, 'en');
    await ctx.answerCbQuery();
    ctx.reply('✅ Language updated to English!');
    return;
  }

  @Action('set_lang_es')
  async setSpanish(@Ctx() ctx: Context) {
    const userId = ctx.from.id.toString();
    await this.userService.updateLanguage(userId, 'es');
    await ctx.answerCbQuery();
    ctx.reply('✅ ¡Idioma actualizado a Español!');
    return;
  }
}
