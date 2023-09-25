import { Field, InputType } from '@nestjs/graphql';
import { CommonInputDto } from '@/common/dto/common-input.dto';

@InputType()
export class CourseInputDto extends CommonInputDto {
  @Field({
    description: '课程名称',
  })
  name: string;

  @Field({
    description: '课程描述',
    nullable: true,
  })
  desc: string;

  @Field({
    description: '适龄人群',
  })
  group: string;

  @Field({
    description: '适合基础',
  })
  baseAbility: string;

  @Field({
    description: '学员人数上限',
  })
  limit: number;

  @Field({ description: '课程时长' })
  duration: number;

  @Field({ description: '预约信息', nullable: true })
  reservation: string;

  @Field({ description: '课程封面', nullable: true })
  cover: string;

  @Field({ description: '退款信息', nullable: true })
  refund: string;

  @Field({ description: '其他说明', nullable: true })
  note: string;
}
