import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentTypeDto {
  @Field({ description: '用户id' })
  id: string;

  @Field({ nullable: true, description: '姓名' })
  name?: string;

  @Field({ nullable: true, description: '手机号码' })
  tel?: string;

  @Field({ nullable: true, description: '头像' })
  avatar?: string;
}
