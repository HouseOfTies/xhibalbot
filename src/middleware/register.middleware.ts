import { Injectable, NestMiddleware } from '@nestjs/common';
import { Context } from 'telegraf';
import { NextFunction } from 'express';
import { UserService } from 'src/Modules/user/user.service';

@Injectable()
export class RegisterMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(ctx: Context, next: NextFunction) {
    if (!ctx.from) return next(); // Si el mensaje no tiene un usuario, lo ignoramos

    const userId = ctx.from.id.toString();
    const language = ctx.from.language_code || 'en';

    // Intentar registrar al usuario si no existe
    await this.userService.findOrCreate(userId, language);

    return next(); // Continuar con la ejecución normal
  }
}
