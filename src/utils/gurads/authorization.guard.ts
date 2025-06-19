// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
// import {Reflector} from '@nestjs/core'

// @Injectable()
// export class AuthorizationGuard implements CanActivate{

//     constructor(private reflector:Reflector){}

//     canActivate(context: ExecutionContext): boolean {
//         console.log('AUthorization Gurad')
        
//         const allowedRole = this.reflector.get<string[]>('allowedRoles',context.getHandler());
//         console.log('allowedRoles' + allowedRole);

//         const request = context.switchToHttp().getRequest();
//         const currentUser = request?.currentUser;

//         console.log('after currentUser ' + currentUser.id)
//         console.log('rolse are ' + currentUser.role)
//         console.log('comparing' + allowedRole.includes(currentUser.role))

//         const result = currentUser?.role.map((r:string) => allowedRole.includes(r));

           
//         if(result) return true; 
        
//         throw new UnauthorizedException('You are not Authorized to access')
        
//     }
// }


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
    console.log('Authorization Guard triggered');

    const allowedRoles = this.reflector.get<string[]>(
      'allowedRoles',
      context.getHandler(),
    );
    console.log('Allowed Roles:', allowedRoles);

    const request = context.switchToHttp().getRequest();
    const currentUser = request?.currentUser;

    if (!currentUser) {
      console.log('No currentUser found');
      throw new UnauthorizedException('Please sign in first');
    }

    console.log('Current user ID:', currentUser.id);
    console.log('User roles:', currentUser.role);

    // if (!allowedRoles || allowedRoles.length === 0) {
    //   return true; // No roles required
    // }

    const userRoles = Array.isArray(currentUser.role)
      ? currentUser.role
      : [currentUser.role]; // normalize to array

    const isAuthorized = userRoles.some((role: string) =>
      allowedRoles.includes(role),
    );

    if (isAuthorized) return true;

    throw new UnauthorizedException('You are not authorized to access this resource');
  }
}
