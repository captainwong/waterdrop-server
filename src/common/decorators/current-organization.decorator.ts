import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentOrganizationId = createParamDecorator(
  (_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const organizationId = ctx.getContext().req.headers['organization-id'];
    return organizationId;
  },
);
