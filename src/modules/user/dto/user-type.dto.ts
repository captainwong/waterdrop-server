import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserTypeDto {
  @Field({description: '用户id'})
  id?: number;

  @Field({description: '姓名'})
  name: string;

  @Field({description: '描述'})
  desc: string;

  @Field({description: '手机号码'})
  tel: string;

  @Field({description: '密码'})
  password: string;

  @Field({description: '账户信息'})
  account: string;
}