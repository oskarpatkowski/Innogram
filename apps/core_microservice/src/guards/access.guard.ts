import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
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
  private readonly logger = new Logger(AccessGuard.name);

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      this.logger.warn('No authentication token found in request');
      throw new UnauthorizedException('Authentication token is missing');
    }

    try {
      const validation = await this.authService.validateToken(token);

      if (
        !validation ||
        (validation as unknown) === false ||
        validation.isValid === false
      ) {
        throw new UnauthorizedException(
          'Invalid or expired authentication token',
        );
      }

      const payload = (validation?.tokenPayload ||
        validation) as Partial<AppJwtPayload>;

      if (!payload || !payload.userId) {
        this.logger.warn(
          `Invalid token validation response format: ${JSON.stringify(validation)}`,
        );
        throw new UnauthorizedException('Invalid token validation response');
      }

      request.user = payload as AppJwtPayload;

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Unexpected error during token validation', error);
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    const cookies = request.cookies as Record<string, unknown> | undefined;

    const cookieToken = cookies?.['accessToken'];

    if (typeof cookieToken === 'string' && cookieToken !== 'undefined') {
      return cookieToken;
    }

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type === 'Bearer' && token && token !== 'undefined') {
      return token;
    }

    return undefined;
  }
}
