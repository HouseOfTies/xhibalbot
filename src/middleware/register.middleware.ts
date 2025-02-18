// import { UserService } from 'src/Modules/user/user.service';
import { UserService } from 'src/Modules/user/user.service';
import { Context, MiddlewareFn } from 'telegraf';

export const RegisterMiddleware =
  (userService: UserService): MiddlewareFn<Context> =>
  async (ctx, next) => {
    if (!ctx.from) return next(); // Ignorar si no hay usuario asociado

    const userId = ctx.from.id.toString();

    // Verificar si el usuario ya está registrado
    const user = await userService.getUser(userId);
    if (!user) {
      await userService.findOrCreate(userId);
      console.log(`✅ Usuario ${userId} registrado automáticamente.`);
    }

    return next();
  };
