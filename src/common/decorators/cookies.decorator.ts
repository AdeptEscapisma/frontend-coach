import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const cookies: Record<string, string | undefined> | undefined = request.cookies;

  return data ? cookies?.[data] : cookies;
});
