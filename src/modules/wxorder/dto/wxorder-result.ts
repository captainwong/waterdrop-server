import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { WxorderTypeDto } from './wxorder-type.dto';

@ObjectType()
export class WxorderResult extends createResult(WxorderTypeDto) {}

@ObjectType()
export class WxorderResults extends createResults(WxorderTypeDto) {}
