import { Command, Ctx, Update, Action } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Markup } from 'telegraf';
import { UserService } from '../user/user.service';

@Update()
export class LanguageCommand {
  constructor(private readonly userService: UserService) {}

  @Command('lang')
  async onLangCommand(@Ctx() ctx: Context) {
    const keyboard = this.getLanguageKeyboard();
    await ctx.reply('🌍 Select your language:', keyboard);
  }

  @Action('set_lang_en')
  async setEnglish(@Ctx() ctx: Context) {
    await this.updateLanguage(ctx, 'en', '✅ Language updated to English!');
  }

  @Action('set_lang_es')
  async setSpanish(@Ctx() ctx: Context) {
    await this.updateLanguage(ctx, 'es', '✅ ¡Idioma actualizado a Español!');
  }

  private getLanguageKeyboard() {
    return Markup.inlineKeyboard([
      [Markup.button.callback('🇺🇸 English', 'set_lang_en')],
      [Markup.button.callback('🇪🇸 Español', 'set_lang_es')],
    ]);
  }

  private async updateLanguage(
    ctx: Context,
    language: 'en' | 'es',
    message: string,
  ) {
    const userId = ctx.from.id.toString();
    await this.userService.updateLanguage(userId, language);
    await ctx.answerCbQuery();
    await ctx.reply(message);
  }
}
