import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ImageTypeDto {
  @Field({ description: 'id' })
  id: string;

  @Field({ description: 'url' })
  url: string;

  @Field({ description: 'remark', nullable: true })
  remark?: string;
}
