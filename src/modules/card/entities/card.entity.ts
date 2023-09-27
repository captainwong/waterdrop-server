import { CardType } from '@/common/const/enum';
import { CommonEntity } from '@/common/entities/common.entity';
import { Course } from '@/modules/course/entities/course.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('cards')
export class Card extends CommonEntity {
  @Column({
    comment: '名称',
    default: '',
  })
  name: string;

  @Column({
    comment: '类型',
    default: CardType.DURATION,
  })
  type: string;

  @Column({
    comment: '最大使用次数',
    default: 0,
  })
  count: number;

  @Column({
    comment: '有效天数',
    default: 0,
  })
  duration: number;

  @ManyToOne(() => Course, (course) => course.cards, { cascade: true })
  course: Course;

  @ManyToOne(() => Organization, (organization) => organization.cards, {
    cascade: true,
  })
  organization: Organization;
}
