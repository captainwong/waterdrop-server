import { CommonEntity } from '@/common/entities/common.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('teachers')
export class Teacher extends CommonEntity {
  @Column({
    comment: '姓名',
    nullable: true,
  })
  name: string;

  @Column({
    comment: '照片',
    nullable: true,
  })
  photo: string;

  @Column({
    comment: '教龄',
    nullable: true,
  })
  teachingAge: number;

  @Column({
    comment: '学历',
    nullable: true,
  })
  education: string;

  @Column({
    comment: '资历',
    nullable: true,
  })
  seniority: string;

  @Column({
    comment: '职业经验',
    nullable: true,
  })
  experience: string;

  @Column({
    comment: '获奖经历',
    nullable: true,
  })
  award: string;

  @Column({
    comment: '风格标签，以，隔开',
    nullable: true,
  })
  tags: string;

  @ManyToOne(() => Organization, { cascade: true })
  organization: Organization;
}
