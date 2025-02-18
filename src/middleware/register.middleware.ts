import { UserService } from 'src/Modules/user/user.service';
import { Context, MiddlewareFn } from 'telegraf';

export const RegisterMiddleware =
  (userService: UserService): MiddlewareFn<Context> =>
  async (ctx, next) => {
    if (!ctx.from) return next();

    const userId = ctx.from.id.toString();

    const user = await userService.getUser(userId);
    if (!user) {
      await userService.findOrCreate(userId);
      console.log(`✅ User ${userId} automatically registered.`);
    }

    return next();
  };
