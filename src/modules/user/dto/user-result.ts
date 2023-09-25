import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { UserTypeDto } from './user-type.dto';

@ObjectType()
export class UserResult extends createResult(UserTypeDto) {}

@ObjectType()
export class CourseResults extends createResults(UserTypeDto) {}
