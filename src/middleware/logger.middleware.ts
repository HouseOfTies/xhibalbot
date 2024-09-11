/*
https://docs.nestjs.com/middleware#middleware
*/

import { Context, MiddlewareFn } from 'telegraf';

export const LoggerMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  if (ctx.message) {
    console.log(`Mensaje recibido: ${JSON.stringify(ctx.message, null, 2)}`);
  }
  await next();
};
