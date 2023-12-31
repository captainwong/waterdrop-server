import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CommonInputDto } from '@/common/dto/common-input.dto';
import { PartialCardInputDto } from '@/modules/card/dto/card-input.dto';

@InputType()
export class ProductInputDto extends CommonInputDto {
  @Field({ nullable: true, description: 'id' })
  id?: string;

  @Field({
    description: '名称',
  })
  name: string;

  @Field({
    description: '描述',
    nullable: true,
  })
  desc: string;

  @Field({
    description: '分类',
    nullable: true,
  })
  category: string;

  @Field({
    description: '状态',
  })
  status: string;

  @Field({
    description: '库存',
  })
  stock: number;

  @Field({
    description: '销量',
  })
  sales: number;

  @Field({
    description: '限购',
  })
  limit: number;

  @Field({
    description: '价格',
  })
  price: string;

  @Field({
    description: '原价',
  })
  originalPrice: string;

  @Field({
    description: '封面',
  })
  cover: string;

  @Field({
    description: 'banner',
  })
  banner: string;

  @Field(() => [PartialCardInputDto], { description: '卡片' })
  cards: PartialCardInputDto[];
}

@InputType()
export class PartialProductInputDto extends PartialType(ProductInputDto) {}
