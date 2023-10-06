import { CommonEntity } from '@/common/entities/common.entity';
import { Card } from '@/modules/card/entities/card.entity';
import { Course } from '@/modules/course/entities/course.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { Student } from '@/modules/student/entities/student.entity';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('student_cards')
export class StudentCard extends CommonEntity {
  @Column({
    comment: '购买时间',
    type: 'timestamp',
  })
  @IsNotEmpty()
  purchasedAt: Date;

  @Column({
    comment: '生效时间',
    type: 'timestamp',
    nullable: true,
  })
  effectiveAt: Date;

  @Column({
    comment: '失效时间',
    type: 'timestamp',
    nullable: true,
  })
  expiresAt: Date;

  // 剩余可用次数，仅当购买的是次数卡时有效
  @Column({
    comment: '剩余可用次数',
    nullable: true,
  })
  remainingTimes: number;

  @ManyToOne(() => Card)
  card: Card;

  @ManyToOne(() => Student)
  student: Student;

  @ManyToOne(() => Course)
  course: Course;

  @ManyToOne(() => Organization)
  organization: Organization;
}
