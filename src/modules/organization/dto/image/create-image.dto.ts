import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateImageDto {
  @Field({ description: 'url' })
  url: string;

  @Field({ description: 'remark', nullable: true })
  remark?: string;
}
