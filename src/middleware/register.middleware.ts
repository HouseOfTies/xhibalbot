import { PlayerService } from 'src/Modules/player/player.service';
import { Context, MiddlewareFn } from 'telegraf';

export const RegisterMiddleware =
  (playerService: PlayerService): MiddlewareFn<Context> =>
  async (ctx, next) => {
    if (!ctx.from) return next();

    const userId = ctx.from.id.toString();

    const user = await playerService.getUser(userId);
    if (!user) {
      await playerService.findOrCreate(userId);
      console.log(`✅ User ${userId} automatically registered.`);
    }

    return next();
  };
