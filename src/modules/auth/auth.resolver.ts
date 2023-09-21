import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Result } from '@/common/dto/result.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Result, { description: 'Send verification code' })
  async sendVerificationCode(@Args('tel') tel: string): Promise<Result> {
    return this.authService.sendVerificationCode(tel);
  }

  @Mutation(() => Result, { description: 'Login' })
  async login(
    @Args('tel') tel: string,
    @Args('smsCode') code: string,
  ): Promise<Result> {
    return this.authService.login(tel, code);
  }

  @Mutation(() => Result, { description: 'Student Register' })
  async studentRegister(
    @Args('account') account: string,
    @Args('password') password: string,
  ): Promise<Result> {
    return this.authService.studentRegister(account, password);
  }

  @Mutation(() => Result, { description: 'Student Login' })
  async studentLogin(
    @Args('account') account: string,
    @Args('password') password: string,
  ): Promise<Result> {
    return this.authService.studentLogin(account, password);
  }
}
