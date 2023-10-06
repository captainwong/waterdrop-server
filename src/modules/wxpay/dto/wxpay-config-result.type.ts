import { createResult } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { WxpayConfigType } from './wxpay-config.type';

@ObjectType()
export class WxpayConfigResult extends createResult(WxpayConfigType) {}
