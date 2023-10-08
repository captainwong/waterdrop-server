import { CommonTypeDto } from '@/common/dto/common-type.dto';
import { CourseTypeDto } from '@/modules/course/dto/course-type.dto';
import { OrganizationTypeDto } from '@/modules/organization/dto/organization/organization-type.dto';
import { ScheduleTypeDto } from '@/modules/schedule/dto/schedule-type.dto';
import { StudentTypeDto } from '@/modules/student/dto/student-type.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentScheduleTypeDto extends CommonTypeDto {
  @Field({
    description: '状态',
    nullable: true,
  })
  status: string;

  @Field(() => StudentTypeDto, { nullable: true, description: '学员' })
  student: StudentTypeDto;

  @Field(() => ScheduleTypeDto, { nullable: true, description: '课程表' })
  schedule: ScheduleTypeDto;

  @Field(() => OrganizationTypeDto, { nullable: true, description: '机构信息' })
  organization: OrganizationTypeDto;

  @Field(() => CourseTypeDto, { nullable: true, description: '课程' })
  course: CourseTypeDto;
}
