import { createResult, createResults } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { ScheduleTypeDto } from './schedule-type.dto';

@ObjectType()
export class ScheduleResult extends createResult(ScheduleTypeDto) {}

@ObjectType()
export class ScheduleResults extends createResults(ScheduleTypeDto) {}
