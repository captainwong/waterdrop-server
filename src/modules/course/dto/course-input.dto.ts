import { Field, InputType } from '@nestjs/graphql';
import { CommonInputDto } from '@/common/dto/common-input.dto';
import { TimeSlotsInput } from './common-input.dto';

@InputType()
export class CourseInputDto extends CommonInputDto {
  @Field({ description: '课程名称', nullable: true })
  name: string;

  @Field({ description: '课程描述', nullable: true })
  desc: string;

  @Field({ description: '适龄人群', nullable: true })
  group: string;

  @Field({ description: '适合基础', nullable: true })
  baseAbility: string;

  @Field({ description: '学员人数上限', nullable: true })
  limit: number;

  @Field({ description: '课程时长', nullable: true })
  duration: number;

  @Field({ description: '预约信息', nullable: true })
  reservation: string;

  @Field({ description: '课程封面', nullable: true })
  cover: string;

  @Field({ description: '退款信息', nullable: true })
  refund: string;

  @Field({ description: '其他说明', nullable: true })
  note: string;

  @Field(() => [TimeSlotsInput], { description: '可约时间', nullable: true })
  resavableTimeSlots: TimeSlotsInput[];

  // @Field(() => Organization, {
  //   description: '所属门店',
  // })
  // organization: Organization;
}
