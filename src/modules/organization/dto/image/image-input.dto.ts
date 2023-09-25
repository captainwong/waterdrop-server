import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ImageInputDto {
  @Field({ description: 'url' })
  url: string;

  @Field({ description: 'remark', nullable: true })
  remark?: string;
}
