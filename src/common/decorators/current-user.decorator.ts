import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUserId = createParamDecorator(
  (_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    console.log('CurrentUserId.user', ctx.getContext().req.user);
    const userId = ctx.getContext().req.user.id;
    return userId;
  },
);
