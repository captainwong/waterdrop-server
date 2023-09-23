import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { OrganizationTypeDto } from './organization-type.dto';

@ObjectType()
export class OrganizationResult extends createResult(OrganizationTypeDto) {}

@ObjectType()
export class OrganizationResults extends createResults(OrganizationTypeDto) {}
