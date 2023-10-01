import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentTokenId = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log('CurrentTokenId.user', request.user);
    return request.user.id;
  },
);
