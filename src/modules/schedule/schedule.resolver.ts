import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
import { ScheduleResult, ScheduleResults } from './dto/schedule-result';
import {
  COURSES_HAS_NO_SLOTS_OR_TECHERS_OR_SCHEDULE_IS_FULL,
  CREATE_SCHEDULE_FAILED,
  ORGANIZATION_HAS_NO_COURSES,
  SCHEDULE_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { Result } from '@/common/dto/result.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { CurrentOrganizationId } from '@/common/decorators/current-organization.decorator';
import { CourseService } from '../course/course.service';
import dayjs from 'dayjs';
import { Schedule } from './entities/schedule.entity';
import {
  TWeek,
  TimeSlotType,
  TimeSlotsType,
} from '../course/dto/common-type.dto';

@TokenEntity('user')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class ScheduleResolver {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly courseService: CourseService,
  ) {}

  @Mutation(() => ScheduleResults, { description: 'Create schedule' })
  async createSchedule(
    @CurrentGqlTokenId('userId') userId: string,
    @CurrentOrganizationId() organizationId: string,
    @Args('startAt') startAt: Date,
    @Args('endAt') endAt: Date,
  ): Promise<ScheduleResults> {
    const [courses] = await this.courseService.findAll(
      1,
      100,
      userId,
      organizationId,
    );
    if (!courses || courses.length === 0) {
      return {
        code: ORGANIZATION_HAS_NO_COURSES,
        message: CodeMsg(ORGANIZATION_HAS_NO_COURSES),
      };
    }
    const schedules: Promise<Schedule>[] = [];
    for (const course of courses) {
      if (!course.teachers || course.teachers.length === 0) {
        continue;
      }
      if (
        !course.reservableTimeSlots ||
        course.reservableTimeSlots.length === 0
      ) {
        continue;
      }
      const reservableTimeSlots: Record<string, TimeSlotType[]> = {};
      course.reservableTimeSlots.forEach((timeSlot) => {
        reservableTimeSlots[timeSlot.weekday] = timeSlot.slots;
      });
      let day = dayjs(startAt);
      while (day.isBefore(dayjs(endAt).add(1, 'day'))) {
        const weekday = day.format('dddd').toLowerCase();
        const slots = reservableTimeSlots[weekday];
        if (slots && slots.length > 0) {
          for (const slot of slots) {
            const conflictCount = await this.scheduleService.findConflictCount(
              course.id,
              day.toDate(),
              slot.start,
              slot.end,
            );
            if (conflictCount === 0) {
              const schedule = this.scheduleService.createInstance({
                createdBy: userId,
                organization: {
                  id: organizationId,
                },
                course: {
                  id: course.id,
                },
                teacher: {
                  id: course.teachers[0].id,
                },
                date: day.toDate(),
                start: slot.start,
                end: slot.end,
                limit: course.limit,
              });
              schedules.push(schedule);
            }
          }
        }
        day = day.add(1, 'day');
      }
    }

    if (schedules.length === 0) {
      return {
        code: COURSES_HAS_NO_SLOTS_OR_TECHERS_OR_SCHEDULE_IS_FULL,
        message: CodeMsg(COURSES_HAS_NO_SLOTS_OR_TECHERS_OR_SCHEDULE_IS_FULL),
      };
    }

    const instances = await Promise.all(schedules);
    const res = await this.scheduleService.saveInstances(instances);
    return res.length > 0
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: res }
      : {
          code: CREATE_SCHEDULE_FAILED,
          message: CodeMsg(CREATE_SCHEDULE_FAILED),
        };
  }

  @Query(() => ScheduleResult, { description: 'Find schedule by id' })
  async getScheduleInfo(@Args('id') id: string): Promise<ScheduleResult> {
    const schedule = await this.scheduleService.findOne(id);
    return schedule
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: schedule }
      : { code: SCHEDULE_NOT_EXISTS, message: CodeMsg(SCHEDULE_NOT_EXISTS) };
  }

  @Query(() => ScheduleResults, { description: 'Find schedules' })
  async getSchedules(
    @CurrentGqlTokenId('userId') userId: string,
    @Args('page') pageInput: PageInput,
  ): Promise<ScheduleResults> {
    const { page, pageSize } = pageInput;
    const [schedules, total] = await this.scheduleService.findAll(
      page,
      pageSize,
      userId,
    );
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: schedules,
      page: {
        page,
        pageSize,
        total,
      },
    };
  }

  @Mutation(() => Result, { description: 'Delete schedule by id' })
  async deleteSchedule(
    @CurrentGqlTokenId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteSchedule', id, userId);
    const res = await this.scheduleService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: SCHEDULE_NOT_EXISTS,
          message: CodeMsg(SCHEDULE_NOT_EXISTS),
        };
  }
}
