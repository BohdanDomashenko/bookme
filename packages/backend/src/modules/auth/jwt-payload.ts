import type { Request } from 'express';

export interface JwtAccessPayload {
  id: string;
}

export type RequestWithJwtUser = Request & { user?: JwtAccessPayload };
