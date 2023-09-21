import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateStudentDto {
  @Field({ nullable: true, description: '姓名' })
  name?: string;

  @Field({ nullable: true, description: '手机号码' })
  tel?: string;

  @Field({ nullable: true, description: '头像' })
  avatar?: string;

  // FIXME： 这里的 password 不能随便修改，临时给DEV环境使用
  @Field({ nullable: true, description: '密码' })
  password?: string;
}