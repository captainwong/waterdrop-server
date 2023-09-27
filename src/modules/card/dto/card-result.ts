import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { CardTypeDto } from './card-type.dto';

@ObjectType()
export class CardResult extends createResult(CardTypeDto) {}

@ObjectType()
export class CardResults extends createResults(CardTypeDto) {}
