import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { StudentScheduleTypeDto } from './student-schedule-type.dto';

@ObjectType()
export class StudentScheduleResult extends createResult(
  StudentScheduleTypeDto,
) {}

@ObjectType()
export class StudentScheduleResults extends createResults(
  StudentScheduleTypeDto,
) {}
