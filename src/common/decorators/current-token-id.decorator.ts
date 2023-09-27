import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentTokenId = createParamDecorator(
  (_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    console.log('CurrentUserId.user', ctx.getContext().req.user);
    const tokenId = ctx.getContext().req.user.id;
    return tokenId;
  },
);
