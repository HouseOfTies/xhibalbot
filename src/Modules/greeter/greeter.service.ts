import { Start, Update, Sender, Command, On } from 'nestjs-telegraf';
import { UpdateType } from 'src/common/decorators/update-type.decorator';
import { NlpServiceService } from 'src/share/services/nlp/nlp-service.service';
import { Context } from 'telegraf';
import { UpdateType as TelegrafUpdateType } from 'telegraf/typings/telegram-types';

@Update()
export class GreeterUpdate {
  constructor(private nlpService: NlpServiceService) {}

  @Start()
  onStart(): string {
    return 'Say hello to me';
  }

  @Command(['hi', 'hello', 'hey', 'qq'])
  onGreetings(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender('first_name') firstName: string,
  ): string {
    return `Hey ${firstName}`;
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('👍');
  }

  @On('text')
  async onText(ctx: Context) {
    const response = await this.nlpService.processMessage('en', ctx.text);
    ctx.reply(response.answer || "Sorry, I didn't understand.");
  }
}
