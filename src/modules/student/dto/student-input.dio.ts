import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentInputDto {
  @Field({ description: '姓名' })
  name: string;

  @Field({ description: '手机号码' })
  tel: string;

  @Field({ description: '头像' })
  avatar: string;

  @Field({ description: '账号' })
  account: string;

  @Field({ description: '密码' })
  password: string;
}
