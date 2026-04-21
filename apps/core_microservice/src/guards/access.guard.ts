import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AppJwtPayload, AuthService } from '../services/auth.service';

export interface JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user: AppJwtPayload;
}

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const { isValid, tokenPayload } =
        await this.authService.validateToken(token);

      request.user = tokenPayload;

      return isValid;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type === 'Bearer' && token) {
      return token;
    }

    const cookies = request.cookies as Record<string, unknown> | undefined;

    const cookieToken = cookies?.['accessToken'];

    if (typeof cookieToken === 'string') {
      return cookieToken;
    }

    return undefined;
  }
}
