import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CommonInputDto {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  createdBy?: string;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  updatedBy?: string;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field({ nullable: true })
  deletedBy?: string;
}
