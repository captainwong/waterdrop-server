import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RemoteIp = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return (
    request.headers['x-forwarded-for'] || request.socket.remoteAddress || ''
  );
});
