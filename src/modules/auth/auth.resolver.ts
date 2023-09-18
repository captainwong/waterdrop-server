import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean, { description: 'Send verification code' })
  async sendVerificationCode(@Args('tel') tel: string): Promise<boolean> {
    return this.authService.sendVerificationCode(tel);
  }

  @Mutation(() => Boolean, { description: 'Login' })
  async login(
    @Args('tel') tel: string,
    @Args('smsCode') code: string,
  ): Promise<boolean> {
    return this.authService.login(tel, code);
  }
}
