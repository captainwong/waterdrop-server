import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { CurrentUserId } from '@/common/decorators/current-user.decorator';
import { CourseResult, CourseResults } from './dto/course-result';
import {
  CREATE_COURSE_FAILED,
  COURSE_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CodeMsg } from '@/common/const/message';
import { Entity } from '@/common/decorators/entity.decorator';
import { EntityGuard } from '@/common/guards/entity.guard';
import { Result } from '@/common/dto/result.dto';

@Entity('user')
@UseGuards(GqlAuthGuard, EntityGuard)
@Resolver()
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => CourseResult, { description: 'Create course' })
  async createOrUpdateCourse(
    @CurrentUserId('userId') userId: string,
    @Args('dto') dto: CreateCourseDto,
    @Args('id', { nullable: true }) id?: string,
  ): Promise<CourseResult> {
    console.log('createOrUpdateCourse', userId, id);
    if (!id) {
      const course = await this.courseService.create({
        ...dto,
        createdBy: userId,
      });
      return course
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: course }
        : {
            code: CREATE_COURSE_FAILED,
            message: CodeMsg(CREATE_COURSE_FAILED),
          };
    } else {
      const course = await this.courseService.update(id, {
        ...dto,
        updatedBy: userId,
      });
      return course
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: course }
        : {
            code: COURSE_NOT_EXISTS,
            message: CodeMsg(COURSE_NOT_EXISTS),
          };
    }
  }

  @Query(() => CourseResult, { description: 'Find course by id' })
  async getCourseInfo(@Args('id') id: string): Promise<CourseResult> {
    const course = await this.courseService.findOne(id);
    return course
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: course }
      : { code: COURSE_NOT_EXISTS, message: CodeMsg(COURSE_NOT_EXISTS) };
  }

  @Query(() => CourseResults, { description: 'Find courses' })
  async getCourses(
    @CurrentUserId('userId') userId: string,
    @Args('page') pageInput: PageInput,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<CourseResults> {
    console.log('getCourses', userId, pageInput, name);
    const { page, pageSize } = pageInput;
    const [courses, total] = await this.courseService.findAll(
      page,
      pageSize,
      userId,
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
    @CurrentUserId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteCourse', id, userId);
    const res = await this.courseService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: COURSE_NOT_EXISTS,
          message: CodeMsg(COURSE_NOT_EXISTS),
        };
  }
}
