import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CommonInputDto } from '@/common/dto/common-input.dto';

@InputType()
export class OrderInputDto extends CommonInputDto {
  @Field({ nullable: true, description: 'id' })
  id?: string;
}

@InputType()
export class PartialOrderInputDto extends PartialType(OrderInputDto) {}
