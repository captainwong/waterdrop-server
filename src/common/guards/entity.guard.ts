import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { ENTITY_KEY } from '../decorators/entity.decorator';

@Injectable()
export class EntityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // see https://github.com/nestjs/nest/issues/2027#issuecomment-527863600
    // works for graphql resolvers
    let entity = this.reflector.get<string>(ENTITY_KEY, context.getClass());
    // for controllers, use this
    if (!entity) {
      entity = this.reflector.get<string>(ENTITY_KEY, context.getHandler());
    }
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    console.log('EntityGuard', entity, user);
    return user && user.entity === entity;
  }
}
