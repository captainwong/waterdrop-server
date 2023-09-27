import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { ProductTypeDto } from './product-type.dto';
import { CategoryType } from './category-type';

@ObjectType()
export class ProductResult extends createResult(ProductTypeDto) {}

@ObjectType()
export class ProductResults extends createResults(ProductTypeDto) {}

@ObjectType()
export class CategoryResults extends createResults(CategoryType) {}
