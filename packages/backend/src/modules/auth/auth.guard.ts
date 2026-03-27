import assert from 'node:assert';
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// biome-ignore lint/style/useImportType: value import required for Nest DI / emitDecoratorMetadata
import { JwtService } from '@nestjs/jwt';
import type { JwtAccessPayload, RequestWithJwtUser } from './jwt-payload';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly _JWT_SECRET: string;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {
    const JWT_SECRET = this.configService.get<string>('JWT_SECRET');
    assert(JWT_SECRET, 'JWT_SECRET is not defined');
    this._JWT_SECRET = JWT_SECRET;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithJwtUser>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // 💡 Here the JWT secret key that's used for verifying the payload
      // is the key that was passsed in the JwtModule
      const payload = await this.jwtService.verifyAsync<JwtAccessPayload>(
        token,
        { secret: this._JWT_SECRET },
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(
    request: RequestWithJwtUser,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
