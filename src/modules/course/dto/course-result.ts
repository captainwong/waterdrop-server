import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { CourseTypeDto } from './course-type.dto';

@ObjectType()
export class CourseResult extends createResult(CourseTypeDto) {}

@ObjectType()
export class CourseResults extends createResults(CourseTypeDto) {}
