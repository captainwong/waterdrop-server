import { Resolver, Query, Context, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { StudentTypeDto } from './dto/student-type.dto';
import { Result } from '@/common/dto/result.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Resolver()
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => StudentTypeDto, { description: 'Find student by id' })
  async findStudent(@Args('id') id: number): Promise<StudentTypeDto> {
    return await this.studentService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => StudentTypeDto, { description: 'Find student by id' })
  async getStudentInfo(@Context() ctx: any): Promise<StudentTypeDto> {
    const id = ctx.req.user.id;
    return await this.studentService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Result, { description: 'Update student by id' })
  async updateStudentInfo(
    @Context() ctx: any,
    @Args('params') params: UpdateStudentDto,
  ): Promise<Result> {
    const id = ctx.req.user.id;
    return await this.studentService.update(id, params);
  }
}
