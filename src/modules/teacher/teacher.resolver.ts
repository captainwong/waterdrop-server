import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { PartialTeacherInputDto } from './dto/teacher-input.dto';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
import { TeacherResult, TeacherResults } from './dto/teacher-result';
import {
  CREATE_TEACHER_FAILED,
  TEACHER_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { Result } from '@/common/dto/result.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { CurrentOrganizationId } from '@/common/decorators/current-organization.decorator';

@TokenEntity('user')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class TeacherResolver {
  constructor(private readonly teacherService: TeacherService) {}

  @Mutation(() => TeacherResult, { description: 'Create teacher' })
  async createOrUpdateTeacher(
    @CurrentGqlTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('dto') dto: PartialTeacherInputDto,
    @Args('id', { nullable: true }) id?: string,
  ): Promise<TeacherResult> {
    console.log('createOrUpdateTeacher', userId, id);
    if (!id) {
      const teacher = await this.teacherService.create({
        ...dto,
        createdBy: userId,
        organization: {
          id: organizationId,
        },
      });
      return teacher
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: teacher }
        : {
            code: CREATE_TEACHER_FAILED,
            message: CodeMsg(CREATE_TEACHER_FAILED),
          };
    } else {
      const teacher = await this.teacherService.update(id, {
        ...dto,
        updatedBy: userId,
      });
      return teacher
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: teacher }
        : {
            code: TEACHER_NOT_EXISTS,
            message: CodeMsg(TEACHER_NOT_EXISTS),
          };
    }
  }

  @Query(() => TeacherResult, { description: 'Find teacher by id' })
  async getTeacherInfo(@Args('id') id: string): Promise<TeacherResult> {
    const teacher = await this.teacherService.findOne(id);
    return teacher
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: teacher }
      : { code: TEACHER_NOT_EXISTS, message: CodeMsg(TEACHER_NOT_EXISTS) };
  }

  @Query(() => TeacherResults, { description: 'Find teachers' })
  async getTeachers(
    @Args('page') pageInput: PageInput,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<TeacherResults> {
    const { page, pageSize } = pageInput;
    const [teachers, total] = await this.teacherService.findAll(
      page,
      pageSize,
      name,
    );
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: teachers,
      page: {
        page,
        pageSize,
        total,
      },
    };
  }

  @Mutation(() => Result, { description: 'Delete teacher by id' })
  async deleteTeacher(
    @CurrentGqlTokenId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteTeacher', id, userId);
    const res = await this.teacherService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: TEACHER_NOT_EXISTS,
          message: CodeMsg(TEACHER_NOT_EXISTS),
        };
  }
}
