import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BatchOnSaleInput {
  @Field(() => [String])
  products: string[];

  @Field()
  onSale: boolean;
}
