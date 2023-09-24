import { CommonTypeDto } from '@/common/dto/common-type.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentTypeDto extends CommonTypeDto {
  @Field({ nullable: true, description: '姓名' })
  name?: string;

  @Field({ nullable: true, description: '手机号码' })
  tel?: string;

  @Field({ nullable: true, description: '头像' })
  avatar?: string;

  @Field({ nullable: true, description: '学生账号' })
  account?: string;
}
