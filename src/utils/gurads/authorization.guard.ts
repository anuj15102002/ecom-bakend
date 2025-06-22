import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );
    
    if (!allowedRoles || allowedRoles.length === 0) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const currentUser = request?.currentUser;

    if (!currentUser) {
      throw new UnauthorizedException('Please sign in first');
    }

    const userRoles = Array.isArray(currentUser.role)
      ? currentUser.role
      : [currentUser.role]; 

    const isAuthorized = userRoles.some((role: string) =>
      allowedRoles.includes(role),
    );

    if (isAuthorized) return true;

    throw new UnauthorizedException('You are not authorized to access this resource');
  }
}
