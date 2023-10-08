import { CommonTypeDto } from '@/common/dto/common-type.dto';
import { CourseTypeDto } from '@/modules/course/dto/course-type.dto';
import { OrganizationTypeDto } from '@/modules/organization/dto/organization/organization-type.dto';
import { StudentScheduleTypeDto } from '@/modules/student-schedule/dto/student-schedule-type.dto';
import { TeacherTypeDto } from '@/modules/teacher/dto/teacher-type.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ScheduleTypeDto extends CommonTypeDto {
  @Field({ nullable: true, description: '上课日期' })
  date?: Date;

  @Field({ nullable: true, description: '上课时间' })
  start?: string;

  @Field({ nullable: true, description: '下课时间' })
  end?: string;

  @Field({ nullable: true, description: '人数限制' })
  limit?: number;

  @Field(() => CourseTypeDto, { nullable: true, description: '课程' })
  course?: CourseTypeDto;

  @Field(() => TeacherTypeDto, { nullable: true, description: '讲师' })
  teacher?: TeacherTypeDto;

  @Field(() => OrganizationTypeDto, { nullable: true, description: '门店' })
  organization?: OrganizationTypeDto;

  @Field(() => [StudentScheduleTypeDto], {
    nullable: true,
    description: '学员预约记录',
  })
  studentSchedules?: StudentScheduleTypeDto[];
}
