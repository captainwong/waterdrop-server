import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true, description: '姓名' })
  name?: string;

  @Field({ nullable: true, description: '描述' })
  desc?: string;

  @Field({ nullable: true, description: '头像' })
  avatar?: string;
}
