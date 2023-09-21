import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateStudentDto {
  @Field({ nullable: true, description: '姓名' })
  name?: string;

  @Field({ nullable: true, description: '手机号码' })
  tel?: string;

  @Field({ nullable: true, description: '头像' })
  avatar?: string;

  @Field({ description: '账号' })
  account: string;

  @Field({ description: '密码' })
  password: string;
}
