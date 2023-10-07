import { CommonEntity } from '@/common/entities/common.entity';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TimeSlotsType } from '../dto/common-type.dto';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { Card } from '@/modules/card/entities/card.entity';
import { Teacher } from '@/modules/teacher/entities/teacher.entity';

@Entity('courses')
export class Course extends CommonEntity {
  @Column({
    comment: '课程名称',
  })
  @IsNotEmpty()
  name: string;

  @Column({
    comment: '分类',
    nullable: true,
  })
  category: string;

  @Column({
    comment: '课程描述',
    nullable: true,
    type: 'text',
  })
  desc: string;

  @Column({
    comment: '适龄人群',
  })
  @IsNotEmpty()
  group: string;

  @Column({
    comment: '适合基础',
  })
  @IsNotEmpty()
  baseAbility: string;

  @Column({
    comment: '学员人数上限',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1000000)
  limit: number;

  @Column({ comment: '课程时长' })
  @IsNotEmpty()
  duration: number;

  @Column({ comment: '预约信息', nullable: true })
  reservation: string;

  @Column({ comment: '课程封面', nullable: true })
  cover: string;

  @Column({ comment: '退款信息', nullable: true })
  refund: string;

  @Column({ comment: '其他说明', nullable: true })
  note: string;

  @Column('simple-json', { comment: '可约时间', nullable: true })
  reservableTimeSlots: TimeSlotsType[];

  @ManyToOne(() => Organization, (organization) => organization.courses, {
    cascade: true,
  })
  organization: Organization;

  @OneToMany(() => Card, (card) => card.course)
  cards: Card[];

  @ManyToMany(() => Teacher)
  @JoinTable({ name: 'course_teachers' })
  teachers: Teacher[];
}
