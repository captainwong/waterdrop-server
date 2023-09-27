import { CommonTypeDto } from '@/common/dto/common-type.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { CourseTypeDto } from '@/modules/course/dto/course-type.dto';

@ObjectType()
export class CardTypeDto extends CommonTypeDto {
  @Field({
    description: '名称',
  })
  name: string;

  @Field({
    description: '类型',
  })
  type: string;

  @Field({
    description: '最大使用次数',
  })
  count: number;

  @Field({
    description: '有效天数',
  })
  duration: number;

  @Field(() => CourseTypeDto, { description: '课程' })
  course: CourseTypeDto;
}
