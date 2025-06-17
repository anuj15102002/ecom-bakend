import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    console.log('decorator')
    const request = ctx.switchToHttp().getRequest();
    
    return request.currentUser;
  },
);