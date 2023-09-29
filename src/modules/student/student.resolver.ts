import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { CurrentTokenId } from '@/common/decorators/current-token-id.decorator';
import { StudentResult, StudentResults } from './dto/student-result';
import {
  CREATE_STUDENT_FAILED,
  STUDENT_ALREADY_EXISTS,
  STUDENT_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { Result, createCodeMsgResult } from '@/common/dto/result.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { StudentInputDto } from './dto/student-input.dto';

@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @TokenEntity('student')
  @Mutation(() => Result, { description: 'Create student' })
  async createStudent(
    @Args('account') account: string,
    @Args('password') password: string,
  ): Promise<Result> {
    const student = await this.studentService.findOneByAccount(account);
    if (student) {
      return createCodeMsgResult(STUDENT_ALREADY_EXISTS);
    }
    const res = await this.studentService.create({ account, password });
    return createCodeMsgResult(res ? SUCCESS : CREATE_STUDENT_FAILED);
  }

  @TokenEntity('student')
  @Query(() => StudentResult, { description: 'Find student by id' })
  async getStudentInfo(
    @CurrentTokenId('id') id: string,
  ): Promise<StudentResult> {
    const student = await this.studentService.findOne(id);
    return student
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: student }
      : { code: STUDENT_NOT_EXISTS, message: CodeMsg(STUDENT_NOT_EXISTS) };
  }

  @TokenEntity('student')
  @Mutation(() => StudentResult, { description: 'Update student by id' })
  async updateStudentInfo(
    @CurrentTokenId('id') id: string,
    @Args('dto') dto: StudentInputDto,
  ): Promise<StudentResult> {
    const res = await this.studentService.update(id, dto);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : { code: STUDENT_NOT_EXISTS, message: CodeMsg(STUDENT_NOT_EXISTS) };
  }

  @TokenEntity('user')
  @Query(() => StudentResults, { description: 'Find students' })
  async getStudents(
    @CurrentTokenId('userId') userId: string,
    @Args('page') pageInput: PageInput,
  ): Promise<StudentResults> {
    const { page, pageSize } = pageInput;
    const [students, total] = await this.studentService.findAll(userId, {
      page,
      pageSize,
    });
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: students,
      page: {
        page,
        pageSize,
        total,
      },
    };
  }
}
