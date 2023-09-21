import { Resolver, Query, Context, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { StudentTypeDto } from './dto/student-type.dto';

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
}
