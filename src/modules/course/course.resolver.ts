import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { CurrentTokenId } from '@/common/decorators/current-token-id.decorator';
import { CourseResult, CourseResults } from './dto/course-result';
import {
  CREATE_COURSE_FAILED,
  COURSE_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { CourseInputDto } from './dto/course-input.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { Result } from '@/common/dto/result.dto';
import { CurrentOrganizationId } from '@/common/decorators/current-organization.decorator';

@TokenEntity('user')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => CourseResult, { description: 'Create course' })
  async createOrUpdateCourse(
    @CurrentTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('dto') dto: CourseInputDto,
    @Args('id', { nullable: true }) id?: string,
  ): Promise<CourseResult> {
    console.log('createOrUpdateCourse', { userId, organizationId, id });
    if (!id) {
      const course = await this.courseService.create(
        userId,
        organizationId,
        dto,
      );
      return course
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: course }
        : {
            code: CREATE_COURSE_FAILED,
            message: CodeMsg(CREATE_COURSE_FAILED),
          };
    } else {
      const course = await this.courseService.update(
        id,
        userId,
        organizationId,
        dto,
      );
      return course
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: course }
        : {
            code: COURSE_NOT_EXISTS,
            message: CodeMsg(COURSE_NOT_EXISTS),
          };
    }
  }

  @Query(() => CourseResult, { description: 'Find course by id' })
  async getCourseInfo(
    @CurrentTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('id') id: string,
  ): Promise<CourseResult> {
    console.log('getCourseInfo', { userId, organizationId, id });
    const course = await this.courseService.findOne(id, userId, organizationId);
    return course
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: course }
      : { code: COURSE_NOT_EXISTS, message: CodeMsg(COURSE_NOT_EXISTS) };
  }

  @Query(() => CourseResults, { description: 'Find courses' })
  async getCourses(
    @CurrentOrganizationId('organizationId') organizationId: string,
    @CurrentTokenId('userId') userId: string,
    @Args('page') pageInput: PageInput,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<CourseResults> {
    console.log('getCourses', { userId, organizationId, pageInput, name });
    const { page, pageSize } = pageInput;
    const [courses, total] = await this.courseService.findAll(
      page,
      pageSize,
      userId,
      organizationId,
      name,
    );
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: courses,
      page: {
        page,
        pageSize,
        total,
      },
    };
  }

  @Mutation(() => Result, { description: 'Delete course by id' })
  async deleteCourse(
    @CurrentTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteCourse', { userId, organizationId, id });
    const res = await this.courseService.remove(id, userId, organizationId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: COURSE_NOT_EXISTS,
          message: CodeMsg(COURSE_NOT_EXISTS),
        };
  }
}
