import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Result } from '@/common/dto/result.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Result, { description: 'Send verification code' })
  async sendVerificationCode(@Args('tel') tel: string): Promise<Result> {
    console.log('sendVerificationCode', { tel });
    return this.authService.sendVerificationCode(tel);
  }

  @Mutation(() => Result, { description: 'Login' })
  async login(
    @Args('tel') tel: string,
    @Args('smsCode') code: string,
  ): Promise<Result> {
    console.log('login', { tel, code });
    return this.authService.login(tel, code);
  }

  @Mutation(() => Result, { description: 'Student Register' })
  async studentRegister(
    @Args('account') account: string,
    @Args('password') password: string,
  ): Promise<Result> {
    console.log('studentRegister', { account, password });
    return this.authService.studentRegister(account, password);
  }

  @Mutation(() => Result, { description: 'Student Login' })
  async studentLogin(
    @Args('account') account: string,
    @Args('password') password: string,
  ): Promise<Result> {
    console.log('studentLogin', { account, password });
    return this.authService.studentLogin(account, password);
  }
}
