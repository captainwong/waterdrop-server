import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudentCardService } from './student-card.service';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
import {
  StudentCardResult,
  StudentCardResults,
} from './dto/student-card-result';
import {
  STUDENT_HAS_NO_VALID_CARDS,
  STUDENT_RECORD_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { Result } from '@/common/dto/result.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { CardStatus } from './const';
import { CardType } from '@/common/const/enum';
import dayjs from 'dayjs';
import { OrganizationResults } from '../organization/dto/organization/organization-result';
import { OrganizationTypeDto } from '../organization/dto/organization/organization-type.dto';
import _ from 'lodash';
import { ScheduleResults } from '../schedule/dto/schedule-result';

@TokenEntity('student')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class StudentCardResolver {
  constructor(private readonly studentCardService: StudentCardService) {}

  @Query(() => StudentCardResult, { description: 'Find studentCard by id' })
  async getStudentCardInfo(@Args('id') id: string): Promise<StudentCardResult> {
    const studentCard = await this.studentCardService.findOne(id);
    return studentCard
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: studentCard }
      : {
          code: STUDENT_RECORD_NOT_EXISTS,
          message: CodeMsg(STUDENT_RECORD_NOT_EXISTS),
        };
  }

  @Query(() => StudentCardResults, { description: 'Find student cards' })
  async getStudentCards(
    @CurrentGqlTokenId('studentId') studentId: string,
    @Args('page') pageInput: PageInput,
  ): Promise<StudentCardResults> {
    const { page, pageSize } = pageInput;
    const [studentCards, total] = await this.studentCardService.findAll(
      page,
      pageSize,
      studentId,
    );
    const cards = studentCards.map((studentCard) => {
      let status = CardStatus.VALID;
      if (dayjs().isAfter(studentCard.expiresAt)) {
        status = CardStatus.EXPIRED;
      } else if (
        studentCard.type === CardType.COUNT &&
        studentCard.remainingTimes === 0
      ) {
        status = CardStatus.DEPLETED;
      }
      return { ...studentCard, status };
    });
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: cards,
      page: {
        page,
        pageSize,
        total,
      },
    };
  }

  @Query(() => OrganizationResults, {
    description: 'Find reservable courses',
  })
  async getReservableCourses(
    @CurrentGqlTokenId('studentId') studentId: string,
  ): Promise<OrganizationResults> {
    // find valid cards for student
    const validCards = await this.studentCardService.findValidCardsForStudent(
      studentId,
    );
    if (validCards.length === 0) {
      return {
        code: STUDENT_HAS_NO_VALID_CARDS,
        message: CodeMsg(STUDENT_HAS_NO_VALID_CARDS),
      };
    }

    // find available courses and deduplicate
    const availableCourses = _.uniqBy(
      validCards.map((card) => card.course),
      'id',
    );

    // group available courses by organization
    const orgsObj: Record<string, OrganizationTypeDto> = {};
    availableCourses.forEach((course) => {
      if (!orgsObj[course.organization.id]) {
        orgsObj[course.organization.id] = {
          ...course.organization,
          courses: [],
        };
      }
      orgsObj[course.organization.id].courses.push(course);
    });
    const orgs: OrganizationTypeDto[] = Object.values(orgsObj);
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: orgs,
    };
  }

  @Query(() => StudentCardResults, {
    description: 'Find valid student cards by course',
  })
  async getValidStudentCardsByCourse(
    @CurrentGqlTokenId('studentId') studentId: string,
    @Args('courseId') courseId: string,
  ): Promise<StudentCardResults> {
    const studentCards = await this.studentCardService.findValidCardsForStudent(
      studentId,
      courseId,
    );
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: studentCards,
    };
  }

  @Mutation(() => Result, { description: 'Delete studentCard by id' })
  async deleteStudentCard(
    @CurrentGqlTokenId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteStudentCard', id, userId);
    const res = await this.studentCardService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: STUDENT_RECORD_NOT_EXISTS,
          message: CodeMsg(STUDENT_RECORD_NOT_EXISTS),
        };
  }
}
