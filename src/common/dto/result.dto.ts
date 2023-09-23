import { ClassType } from 'type-graphql';
import PageTypeDto from './page-type.dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CodeMsg } from '../const/message';

export interface IResult<T> {
  code: number;
  message?: string;
  data?: T;
}

export interface IResults<T> {
  code: number;
  message?: string;
  data?: T[];
  page?: PageTypeDto;
}

export function createResult<T>(ItemType: ClassType<T>): ClassType<IResult<T>> {
  @ObjectType()
  class Result implements IResult<T> {
    @Field(() => Int, { description: '状态码' })
    code: number;

    @Field(() => String, { nullable: true, description: '信息' })
    message?: string;

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

    @Field(() => String, { nullable: true, description: '信息' })
    message?: string;

    @Field(() => [ItemType], { nullable: true, description: '数据' })
    data?: T[];

    @Field(() => PageTypeDto, { nullable: true, description: '分页信息' })
    page?: PageTypeDto;
  }

  return Results;
}

@ObjectType()
export class Result {
  @Field(() => Int, { description: '状态码' })
  code: number;

  @Field(() => String, { nullable: true, description: '信息' })
  message?: string;

  @Field(() => String, { nullable: true, description: '数据' })
  data?: string;
}

export function createCodeMsgResult(code: number, data?: string) {
  const result = new Result();
  result.code = code;
  result.message = CodeMsg(code);
  result.data = data;
  return result;
}
