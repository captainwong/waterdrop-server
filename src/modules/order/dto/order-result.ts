import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { OrderTypeDto } from './order-type.dto';

@ObjectType()
export class OrderResult extends createResult(OrderTypeDto) {}

@ObjectType()
export class OrderResults extends createResults(OrderTypeDto) {}
