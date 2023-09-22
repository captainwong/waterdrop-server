import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { StudentTypeDto } from './student-type.dto';

@ObjectType()
export class StudentResult extends createResult(StudentTypeDto) {}

@ObjectType()
export class StudentResults extends createResults(StudentTypeDto) {}
