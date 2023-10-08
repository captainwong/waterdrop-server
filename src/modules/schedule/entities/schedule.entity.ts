import { CommonEntity } from '@/common/entities/common.entity';
import { Course } from '@/modules/course/entities/course.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { StudentSchedule } from '@/modules/student-schedule/entities/student-schedule.entity';
import { Teacher } from '@/modules/teacher/entities/teacher.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('schedules')
export class Schedule extends CommonEntity {
  @Column({
    comment: '上课日期',
    nullable: true,
    type: 'timestamp',
  })
  date: Date;

  @Column({
    comment: '上课时间',
    nullable: true,
  })
  start: string;

  @Column({
    comment: '下课时间',
    nullable: true,
  })
  end: string;

  @Column({
    comment: '人数限制',
    nullable: true,
  })
  limit: number;

  @ManyToOne(() => Organization)
  organization: Organization;

  @ManyToOne(() => Course)
  course: Course;

  @ManyToOne(() => Teacher)
  teacher: Teacher;

  @OneToMany(
    () => StudentSchedule,
    (studentSchedule) => studentSchedule.schedule,
  )
  studentSchedules: StudentSchedule[];
}
