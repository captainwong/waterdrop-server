import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const RemoteGqlIp = createParamDecorator(
  (_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    const request = ctx.req;
    // console.log('RemoteGqlIp.request', request);
    return (
      request.headers['x-forwarded-for'] || request.socket.remoteAddress || ''
    );
  },
);
