import { Field, InputType } from '@nestjs/graphql';
import { IsInt, Max, Min } from 'class-validator';

@InputType()
export class PageInput {
  @Field({ description: '页码' })
  @IsInt()
  @Min(1)
  page: number;

  @Field({ description: '每页数量' })
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number;
}
