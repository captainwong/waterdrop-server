import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentGqlTokenId = createParamDecorator(
  (_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    console.log('CurrentGqlTokenId.user', ctx.getContext().req.user);
    const tokenId = ctx.getContext().req.user.id;
    return tokenId;
  },
);
