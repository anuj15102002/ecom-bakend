import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Repository } from 'typeorm';
import { RevokedTokenEntity } from '../../user/entities/revoked-token.entity';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();
    if(!request.currentUser){
      throw new UnauthorizedException('User is not authenticated.')
    }
    return true;
    
  }
}


