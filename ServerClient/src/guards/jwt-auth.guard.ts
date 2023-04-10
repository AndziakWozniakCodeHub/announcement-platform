import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RoleNames } from 'src/typeorm/user.entity';
import { ROLES_KEY } from 'src/users/decorators/roles.decorator';
import { AuthService } from 'src/auth/services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('JWT token required.');
    }

    request.payload = await this.authService.decodeUserToken(token);

    if (!request.payload) {
      throw new UnauthorizedException('No payload from decoded user token.');
    }

    const requiredRoles: RoleNames[] = this.reflector.get(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles || !requiredRoles.length) {
      return true;
    }

    const userRoles: RoleNames[] =
      request.payload.customer.roles?.map((role) => role.name) || [];

    if (!requiredRoles.some((role) => userRoles.includes(role))) {
      throw new ForbiddenException(
        `This endpoint requires one of ${requiredRoles.join(', ')} roles.`,
      );
    }

    return true;
  }

  extractToken(req: Request): string {
    const token = req.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }
}
