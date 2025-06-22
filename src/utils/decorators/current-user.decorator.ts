import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    console.log('decorator')
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.currentUser;
    
  },
);