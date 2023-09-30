import { Field, InputType } from '@nestjs/graphql';
import { TWeek } from './common-type.dto';

@InputType()
export class TimeSlotInput {
  @Field({ description: '开始时间' })
  start: string;

  @Field({ description: '结束时间' })
  end: string;

  @Field({ description: 'key' })
  key: number;
}

@InputType()
export class TimeSlotsInput {
  @Field({ description: 'weekday' })
  weekday: TWeek;

  @Field(() => [TimeSlotInput], { description: 'time slots' })
  slots: TimeSlotInput[];
}
