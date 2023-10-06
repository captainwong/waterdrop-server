import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { StudentCardTypeDto } from './student-card-type.dto';

@ObjectType()
export class StudentCardResult extends createResult(StudentCardTypeDto) {}

@ObjectType()
export class StudentCardResults extends createResults(StudentCardTypeDto) {}
