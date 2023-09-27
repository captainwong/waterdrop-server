import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { TOKEN_ENTITY_KEY } from '../decorators/token-entity.decorator';

@Injectable()
export class TokenEntityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // see https://github.com/nestjs/nest/issues/2027#issuecomment-527863600
    // works for graphql resolvers
    let entity = this.reflector.get<string>(
      TOKEN_ENTITY_KEY,
      context.getClass(),
    );
    // for controllers, use this
    if (!entity) {
      entity = this.reflector.get<string>(
        TOKEN_ENTITY_KEY,
        context.getHandler(),
      );
    }
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    console.log('TokenEntityGuard', entity, user);
    return user && user.entity === entity;
  }
}
