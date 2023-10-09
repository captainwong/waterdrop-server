import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudentScheduleService } from './student-schedule.service';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
import {
  StudentScheduleResult,
  StudentScheduleResults,
} from './dto/student-schedule-result';
import {
  CANCEL_STUDENT_SCHEDULE_FAILED,
  CREATE_STUDENT_SCHEDULE_FAILED,
  SCHEDULE_ALREADY_RESERVED,
  SCHEDULE_NOT_EXISTS,
  STUDENT_CARD_DEPLETED,
  STUDENT_CARD_EXPIRED,
  STUDENT_CARD_NOT_EXISTS,
  STUDENT_SCHEDULE_ALREADY_IN_PROGRESS,
  STUDENT_SCHEDULE_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { Result } from '@/common/dto/result.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { StudentCardService } from '../student-card/student-card.service';
import { ScheduleService } from '../schedule/schedule.service';
import dayjs from 'dayjs';
import { CardType } from '@/common/const/enum';
import { StudentScheduleStatus } from './const';
import { combineDateAndTime } from '@/utils/date';

@TokenEntity('student')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class StudentScheduleResolver {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly studentScheduleService: StudentScheduleService,
    private readonly studentCardService: StudentCardService,
  ) {}

  @Mutation(() => Result, { description: 'Reserve schedule' })
  async reserveSchedule(
    @CurrentGqlTokenId('studentId') studentId: string,
    @Args('scheduleId') scheduleId: string,
    @Args('studentCardId') studentCardId: string,
  ): Promise<Result> {
    const schedule = await this.scheduleService.findOne(scheduleId);
    if (!schedule) {
      return {
        code: SCHEDULE_NOT_EXISTS,
        message: CodeMsg(SCHEDULE_NOT_EXISTS),
      };
    }

    const card = await this.studentCardService.findOne(
      studentCardId,
      studentId,
    );
    if (!card) {
      return {
        code: STUDENT_CARD_NOT_EXISTS,
        message: CodeMsg(STUDENT_CARD_NOT_EXISTS),
      };
    }

    if (dayjs().isAfter(card.expiresAt)) {
      return {
        code: STUDENT_CARD_EXPIRED,
        message: CodeMsg(STUDENT_CARD_EXPIRED),
      };
    }

    if (card.type === CardType.COUNT && card.remainingTimes === 0) {
      return {
        code: STUDENT_CARD_DEPLETED,
        message: CodeMsg(STUDENT_CARD_DEPLETED),
      };
    }

    if (
      await this.studentScheduleService.isScheduleAlreadyReserved(
        studentId,
        scheduleId,
      )
    ) {
      return {
        code: SCHEDULE_ALREADY_RESERVED,
        message: CodeMsg(SCHEDULE_ALREADY_RESERVED),
      };
    }

    // TODO: use transaction
    const studentSchedule = await this.studentScheduleService.create({
      student: { id: studentId },
      schedule: { id: scheduleId },
      studentCard: { id: studentCardId },
      course: { id: schedule.course.id },
      organization: { id: schedule.organization.id },
    });
    if (!studentSchedule) {
      return {
        code: CREATE_STUDENT_SCHEDULE_FAILED,
        message: CodeMsg(CREATE_STUDENT_SCHEDULE_FAILED),
      };
    }

    if (card.type === CardType.COUNT) {
      const res = await this.studentCardService.update(studentCardId, {
        remainingTimes: card.remainingTimes - 1,
      });
      if (!res) {
        await this.studentScheduleService.remove(studentSchedule.id, studentId);
        return {
          code: CREATE_STUDENT_SCHEDULE_FAILED,
          message: CodeMsg(CREATE_STUDENT_SCHEDULE_FAILED),
        };
      }
    }

    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
    };
  }

  @Query(() => StudentScheduleResult, {
    description: 'Find student-schedule by id',
  })
  async getStudentScheduleInfo(
    @Args('id') id: string,
  ): Promise<StudentScheduleResult> {
    const studentSchedule = await this.studentScheduleService.findOne(id);
    return studentSchedule
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: studentSchedule }
      : {
          code: STUDENT_SCHEDULE_NOT_EXISTS,
          message: CodeMsg(STUDENT_SCHEDULE_NOT_EXISTS),
        };
  }

  @Query(() => StudentScheduleResults, { description: 'Find studentSchedules' })
  async getStudentSchedules(
    @CurrentGqlTokenId('studentId') studentId: string,
    @Args('page') pageInput: PageInput,
  ): Promise<StudentScheduleResults> {
    const { page, pageSize } = pageInput;
    const [studentSchedules, total] = await this.studentScheduleService.findAll(
      page,
      pageSize,
      studentId,
    );
    for (let i = 0; i < studentSchedules.length; i += 1) {
      const studentSchedule = studentSchedules[i];
      if (!studentSchedule.status) {
        studentSchedule.status = StudentScheduleStatus.NOT_STARTED;
        const endTime = combineDateAndTime(
          studentSchedule.schedule.date,
          studentSchedule.schedule.end,
        );
        const now = dayjs();
        if (now.isAfter(endTime)) {
          studentSchedule.status = StudentScheduleStatus.FINISHED;
        } else {
          const start = combineDateAndTime(
            studentSchedule.schedule.date,
            studentSchedule.schedule.start,
          );
          if (now.isAfter(start)) {
            studentSchedule.status = StudentScheduleStatus.IN_PROGRESS;
          }
          console.log({
            status: studentSchedule.status,
            now: now.format('YYYY-MM-DD HH:mm:ss'),
            start: start.format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
          });
        }
      }
    }
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: studentSchedules,
      page: {
        page,
        pageSize,
        total,
      },
    };
  }

  @Mutation(() => Result, { description: 'Cancel student-schedule by id' })
  async cancelStudentSchedule(
    @CurrentGqlTokenId('studentId') studentId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    const studentSchedule = await this.studentScheduleService.findOne(id);
    if (!studentSchedule) {
      return {
        code: STUDENT_SCHEDULE_NOT_EXISTS,
        message: CodeMsg(STUDENT_SCHEDULE_NOT_EXISTS),
      };
    }

    if (studentSchedule.status === StudentScheduleStatus.CANCELED) {
      return {
        code: SUCCESS,
        message: CodeMsg(SUCCESS),
      };
    }

    const start = combineDateAndTime(
      studentSchedule.schedule.date,
      studentSchedule.schedule.start,
    );
    if (dayjs().isAfter(start.subtract(15, 'minute'))) {
      return {
        code: STUDENT_SCHEDULE_ALREADY_IN_PROGRESS,
        message: CodeMsg(STUDENT_SCHEDULE_ALREADY_IN_PROGRESS),
      };
    }

    // TODO: use transaction
    const res = await this.studentScheduleService.update(id, {
      status: StudentScheduleStatus.CANCELED,
    });
    if (!res) {
      return {
        code: CANCEL_STUDENT_SCHEDULE_FAILED,
        message: CodeMsg(CANCEL_STUDENT_SCHEDULE_FAILED),
      };
    }

    if (studentSchedule.studentCard.type === CardType.COUNT) {
      const card = await this.studentCardService.findOne(
        studentSchedule.studentCard.id,
        studentId,
      );
      if (!card) {
        return {
          code: STUDENT_CARD_NOT_EXISTS,
          message: CodeMsg(STUDENT_CARD_NOT_EXISTS),
        };
      }
      const res = await this.studentCardService.update(card.id, {
        remainingTimes: card.remainingTimes + 1,
      });
      if (!res) {
        return {
          code: CANCEL_STUDENT_SCHEDULE_FAILED,
          message: CodeMsg(CANCEL_STUDENT_SCHEDULE_FAILED),
        };
      }
    }

    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
    };
  }

  @Mutation(() => Result, { description: 'Delete student-schedule by id' })
  async deleteStudentSchedule(
    @CurrentGqlTokenId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteStudentSchedule', id, userId);
    const res = await this.studentScheduleService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: STUDENT_SCHEDULE_NOT_EXISTS,
          message: CodeMsg(STUDENT_SCHEDULE_NOT_EXISTS),
        };
  }
}
