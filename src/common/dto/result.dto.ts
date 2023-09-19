import { ClassType } from 'type-graphql';
import Pagination from './page.dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';

interface IResult<T> {
  code: number;
  message: string;
  data?: T;
}

interface IResults<T> {
  code: number;
  message: string;
  data?: T[];
  page?: Pagination;
}

export function createResult<T>(ItemType: ClassType<T>): ClassType<IResult<T>> {
  @ObjectType()
  class Result implements IResult<T> {
    @Field(() => Int, { description: '状态码' })
    code: number;

    @Field(() => String, { description: '提示信息' })
    message: string;

    @Field(() => ItemType, { nullable: true, description: '数据' })
    data?: T;
  }

  return Result;
}

export function createResults<T>(
  ItemType: ClassType<T>,
): ClassType<IResults<T>> {
  @ObjectType()
  class Results implements IResults<T> {
    @Field(() => Int, { description: '状态码' })
    code: number;

    @Field(() => String, { description: '提示信息' })
    message: string;

    @Field(() => [ItemType], { nullable: true, description: '数据' })
    data?: T[];

    @Field(() => Pagination, { nullable: true, description: '分页信息' })
    page?: Pagination;
  }

  return Results;
}

@ObjectType()
export class Result {
  @Field(() => Int, { description: '状态码' })
  code: number;

  @Field(() => String, { nullable: true, description: '提示信息' })
  message?: string;

  @Field(() => String, { nullable: true, description: '数据' })
  data?: string;
}
