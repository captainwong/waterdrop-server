import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInputDto {
  @Field({ description: '用户id' })
  id: string;

  @Field({ description: '姓名' })
  name?: string;

  @Field({ description: '描述' })
  desc?: string;

  @Field({ nullable: true, description: '头像' })
  avatar?: string;

  @Field({ description: '手机号码' })
  tel?: string;

  @Field({ nullable: true, description: '短信验证码' })
  smsCode?: string;

  @Field({ nullable: true, description: '短信验证码创建时间' })
  smsCodeCreatedAt?: Date;

  @Field({ nullable: true, description: '账号' })
  account?: string;

  @Field({ nullable: true, description: '密码' })
  password?: string;
}
