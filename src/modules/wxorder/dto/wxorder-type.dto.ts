import { CommonTypeDto } from '@/common/dto/common-type.dto';
import { OrganizationTypeDto } from '@/modules/organization/dto/organization/organization-type.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WxorderTypeDto extends CommonTypeDto {
  @Field({
    description: '微信公众号ID',
  })
  appid: string;

  @Field({
    description: '商户号',
  })
  mchid: string;

  @Field({
    description: 'openid',
    nullable: true,
  })
  openid: string;

  @Field({
    description: '交易类型',
    nullable: true,
  })
  trade_type: string;

  @Field({
    description: '交易状态',
    nullable: true,
  })
  trade_state: string;

  @Field({
    description: '银行',
    nullable: true,
  })
  bank_type: string;

  @Field({
    description: '微信支付订单号',
    nullable: true,
  })
  transaction_id: string;

  @Field({
    description: '商户订单号',
    nullable: true,
  })
  out_trade_no: string;

  @Field({
    description: '附加数据',
    nullable: true,
  })
  attach: string;

  @Field({
    description: '交易状态描述',
    nullable: true,
  })
  trade_state_desc: string;

  @Field({
    description: '支付完成时间',
    nullable: true,
  })
  success_time: string;

  @Field({
    description: '订单总金额，单位为分',
    nullable: true,
  })
  total: number;

  @Field({
    description: '用户支付金额，单位为分',
    nullable: true,
  })
  payer_total: number;

  @Field({
    description: 'CNY：人民币，境内商户号仅支持人民币',
    nullable: true,
  })
  currency: string;

  @Field({
    description: '用户支付币种，示例值：CNY',
    nullable: true,
  })
  payer_currency: string;

  @Field(() => OrganizationTypeDto, { nullable: true, description: '门店' })
  organization?: OrganizationTypeDto;
}

/*
{
  mchid: 'xxxxxxxxxxxxxxxxxx',
  appid: 'xxxxxxxxxxxxxxxxxx',
  out_trade_no: 'f00daf10a6a74d2fa361275d5c8ea179',
  transaction_id: '4200001972202310068553552073',
  trade_type: 'JSAPI',
  trade_state: 'SUCCESS',
  trade_state_desc: '支付成功',
  bank_type: 'OTHERS',
  attach: '',
  success_time: '2023-10-06T05:50:46+08:00',
  payer: { openid: 'xxxxxxxxxxxxxxxxxx' },
  amount: { total: 1, payer_total: 1, currency: 'CNY', payer_currency: 'CNY' }
}
*/
export type WxorderCbType = WxorderTypeDto & {
  payer: {
    openid: string;
  };
  amount: {
    total: number;
    payer_total: number;
    currency: string;
    payer_currency: string;
  };
};
