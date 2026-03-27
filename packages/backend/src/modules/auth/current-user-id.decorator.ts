import {
  type ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import type { RequestWithJwtUser } from './jwt-payload';

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestWithJwtUser>();
    const id = request.user?.id;
    if (id === undefined) {
      throw new UnauthorizedException();
    }
    return id;
  },
);
