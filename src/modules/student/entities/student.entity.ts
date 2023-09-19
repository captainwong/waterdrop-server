import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn({
    comment: '学生ID',
  })
  id: number;

  @Column({
    comment: '学生姓名',
    nullable: true,
  })
  name: string;

  @Column({
    comment: '学生电话',
    nullable: true,
  })
  tel: string;

  @Column({
    comment: '学生头像',
    nullable: true,
  })
  avatar: string;

  @IsNotEmpty()
  @Column({
    comment: '学生账号',
  })
  account: string;

  @IsNotEmpty()
  @Column({
    comment: '学生密码',
  })
  password: string;
}
