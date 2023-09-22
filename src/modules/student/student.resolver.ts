import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CurrentUserId } from '@/common/decorators/current-user.decorator';
import { StudentResult, StudentResults } from './dto/student-result';
import {
  CREATE_STUDENT_FAILED,
  STUDENT_ALREADY_EXISTS,
  STUDENT_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { Result } from '@/common/dto/result.dto';

@UseGuards(GqlAuthGuard)
@Resolver()
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Mutation(() => Result, { description: 'Create student' })
  async createStudent(
    @Args('account') account: string,
    @Args('password') password: string,
  ): Promise<Result> {
    const student = await this.studentService.findOneByAccount(account);
    if (student) {
      return {
        code: STUDENT_ALREADY_EXISTS,
        message: 'Student already exists',
      };
    }
    const res = await this.studentService.create({ account, password });
    return res ? { code: SUCCESS } : { code: CREATE_STUDENT_FAILED };
  }

  @Query(() => StudentResult, { description: 'Find student by id' })
  async getStudentInfo(
    @CurrentUserId('id') id: string,
  ): Promise<StudentResult> {
    const student = await this.studentService.findOne(id);
    return student
      ? { code: SUCCESS, data: student }
      : { code: STUDENT_NOT_EXISTS, message: 'Student not exists' };
  }

  @Mutation(() => StudentResult, { description: 'Update student by id' })
  async updateStudentInfo(
    @CurrentUserId('id') id: string,
    @Args('params') params: UpdateStudentDto,
  ): Promise<StudentResult> {
    const res = await this.studentService.update(id, params);
    return res
      ? { code: SUCCESS }
      : { code: STUDENT_NOT_EXISTS, message: 'Student not exists' };
  }

  @Query(() => StudentResults, { description: 'Find students' })
  async getStudents(
    @Args('page') pageInput: PageInput,
  ): Promise<StudentResults> {
    const { page, pageSize } = pageInput;
    const [students, total] = await this.studentService.findAll({
      page,
      pageSize,
    });
    return {
      code: SUCCESS,
      data: students,
      page: {
        page,
        pageSize,
        total,
      },
    };
  }
}
