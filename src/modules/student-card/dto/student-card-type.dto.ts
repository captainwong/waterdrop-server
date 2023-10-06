import { CommonTypeDto } from '@/common/dto/common-type.dto';
import { CardTypeDto } from '@/modules/card/dto/card-type.dto';
import { CourseTypeDto } from '@/modules/course/dto/course-type.dto';
import { OrganizationTypeDto } from '@/modules/organization/dto/organization/organization-type.dto';
import { StudentTypeDto } from '@/modules/student/dto/student-type.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentCardTypeDto extends CommonTypeDto {
  @Field({
    description: '购买时间',
  })
  purchasedAt: Date;

  @Field({
    description: '生效时间',
    nullable: true,
  })
  effectiveAt: Date;

  @Field({
    description: '失效时间',
    nullable: true,
  })
  expiresAt: Date;

  // 剩余可用次数，仅当购买的是次数卡时有效
  @Field({
    description: '剩余可用次数',
    nullable: true,
  })
  remainingTimes: number;

  @Field(() => CardTypeDto, { nullable: true })
  card: CardTypeDto;

  @Field(() => StudentTypeDto, { nullable: true })
  student: StudentTypeDto;

  @Field(() => CourseTypeDto, { nullable: true })
  course: CourseTypeDto;

  @Field(() => OrganizationTypeDto, { nullable: true })
  organization: OrganizationTypeDto;
}
