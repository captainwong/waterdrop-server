import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserTypeDto {
  @Field({ description: '用户id' })
  id: string;

  @Field({ description: '姓名' })
  name: string;

  @Field({ description: '描述' })
  desc: string;

  @Field({ description: '手机号码' })
  tel: string;

  @Field({ nullable: true, description: '头像' })
  avatar?: string;

  @Field({ nullable: true, description: '账号' })
  account?: string;
}
