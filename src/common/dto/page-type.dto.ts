import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class PageTypeDto {
  @Field(() => Int, { description: '总数' })
  total: number;

  @Field(() => Int, { description: '页码' })
  page?: number;

  @Field(() => Int, { description: '每页数量' })
  pageSize?: number;
}

export default PageTypeDto;
