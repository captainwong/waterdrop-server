import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Pagination {
  @Field(() => Int, { description: '总数' })
  total: number;

  @Field(() => Int, { description: '偏移量' })
  offset?: number;

  @Field(() => Int, { description: '限制' })
  limit?: number;
}

export default Pagination;
