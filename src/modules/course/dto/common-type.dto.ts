import { Field, ObjectType } from '@nestjs/graphql';

export type TWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

@ObjectType()
export class TimeSlotType {
  @Field({ description: '开始时间' })
  start: string;

  @Field({ description: '结束时间' })
  end: string;

  @Field({ description: 'key' })
  key: number;
}

@ObjectType()
export class TimeSlotsType {
  @Field({ description: 'weekday' })
  weekday: TWeek;

  @Field(() => [TimeSlotType], { description: 'time slots' })
  slots: TimeSlotType[];
}
