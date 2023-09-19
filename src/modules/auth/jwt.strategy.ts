import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'), // 从请求头中获取 token
      secretOrKey: process.env.JWT_SECRET, // jwt密钥
    });
  }

  // Passport 会自动验证 jwt 的有效性，如果 jwt 有效，validate 方法返回的值会被赋值给请求的 user 对象
  async validate(payload: any): Promise<any> {
    if (!payload || !payload.id) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
