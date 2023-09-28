import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { TeacherTypeDto } from './teacher-type.dto';

@ObjectType()
export class TeacherResult extends createResult(TeacherTypeDto) {}

@ObjectType()
export class TeacherResults extends createResults(TeacherTypeDto) {}
