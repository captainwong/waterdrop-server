import { CommonEntity } from '@/common/entities/common.entity';
import { Course } from '@/modules/course/entities/course.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { Schedule } from '@/modules/schedule/entities/schedule.entity';
import { StudentCard } from '@/modules/student-card/entities/student-card.entity';
import { Student } from '@/modules/student/entities/student.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('student_schedules')
export class StudentSchedule extends CommonEntity {
  @Column({
    comment: '状态',
    nullable: true,
  })
  status: string;

  @ManyToOne(() => Student, { cascade: true })
  student: Student;

  @ManyToOne(() => StudentCard, { cascade: true })
  studentCard: StudentCard;

  @ManyToOne(() => Schedule, (schedule) => schedule.studentSchedules, {
    cascade: true,
  })
  schedule: Schedule;

  @ManyToOne(() => Course, { cascade: true })
  course: Course;

  @ManyToOne(() => Organization, {
    cascade: true,
  })
  organization: Organization;
}
