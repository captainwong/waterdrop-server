import { CommonTypeDto } from '@/common/dto/common-type.dto';
import { CardTypeDto } from '@/modules/card/dto/card-type.dto';
import { OrganizationTypeDto } from '@/modules/organization/dto/organization/organization-type.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductTypeDto extends CommonTypeDto {
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
  price: number;

  @Field({
    description: '原价',
  })
  originalPrice: number;

  @Field({
    description: '封面',
  })
  cover: string;

  @Field({
    description: 'banner',
  })
  banner: string;

  @Field(() => OrganizationTypeDto, { description: '机构' })
  organization: OrganizationTypeDto;

  @Field(() => [CardTypeDto], { description: '卡片', nullable: true })
  cards?: CardTypeDto[];
}
