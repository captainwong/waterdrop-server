import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as Guard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends Guard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    console.log('AuthGuard.req.headers', req.headers);
    return req;
  }
}
