import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StudentInputDto {
  @Field({ nullable: true, description: '姓名' })
  name?: string;

  @Field({ nullable: true, description: '手机号码' })
  tel?: string;

  @Field({ nullable: true, description: '头像' })
  avatar?: string;

  @Field({ nullable: true, description: '账号' })
  account?: string;

  @Field({ nullable: true, description: '密码' })
  password?: string;
}
