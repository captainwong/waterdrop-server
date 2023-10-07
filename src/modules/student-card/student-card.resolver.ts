import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudentCardService } from './student-card.service';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
import {
  StudentCardResult,
  StudentCardResults,
} from './dto/student-card-result';
import { STUDENT_RECORD_NOT_EXISTS, SUCCESS } from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { Result } from '@/common/dto/result.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { CardStatus } from './const';
import { CardType } from '@/common/const/enum';
import dayjs from 'dayjs';

@TokenEntity('student')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class StudentCardResolver {
  constructor(private readonly studentRecordService: StudentCardService) {}

  @Query(() => StudentCardResult, { description: 'Find studentCard by id' })
  async getStudentCardInfo(@Args('id') id: string): Promise<StudentCardResult> {
    const studentCard = await this.studentRecordService.findOne(id);
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
    const [studentCards, total] = await this.studentRecordService.findAll(
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

  @Mutation(() => Result, { description: 'Delete studentCard by id' })
  async deleteStudentCard(
    @CurrentGqlTokenId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteStudentCard', id, userId);
    const res = await this.studentRecordService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: STUDENT_RECORD_NOT_EXISTS,
          message: CodeMsg(STUDENT_RECORD_NOT_EXISTS),
        };
  }
}
