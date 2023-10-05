import { CommonTypeDto } from '@/common/dto/common-type.dto';
import { OrganizationTypeDto } from '@/modules/organization/dto/organization/organization-type.dto';
import { ProductTypeDto } from '@/modules/product/dto/product-type.dto';
import { StudentTypeDto } from '@/modules/student/dto/student-type.dto';
import { WxorderTypeDto } from '@/modules/wxorder/dto/wxorder-type.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderTypeDto extends CommonTypeDto {
  @Field({ nullable: true })
  id: string;

  @Field({
    description: '数量',
  })
  quantity: number;

  @Field({
    description: 'amount',
  })
  amount: number;

  @Field({
    description: '手机号',
  })
  tel: string;

  @Field({
    description: '状态',
  })
  status: string;

  @Field({
    description: 'createdAt',
    nullable: true,
  })
  createdAt: Date;

  @Field({
    description: '订单号',
    nullable: true,
  })
  outTradeNo: string;

  @Field(() => StudentTypeDto, { nullable: true, description: '购买学员' })
  student: StudentTypeDto;

  @Field(() => OrganizationTypeDto, { nullable: true, description: '机构' })
  organization: OrganizationTypeDto;

  @Field(() => ProductTypeDto, { nullable: true, description: '商品' })
  product: ProductTypeDto;

  @Field(() => WxorderTypeDto, { nullable: true, description: '微信订单信息' })
  wxorder?: WxorderTypeDto;
}
