import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({
    comment: '用户ID',
  })
  id: number;

  @Column({
    comment: '用户名',
    default: '',
  })
  @IsNotEmpty()
  name: string;

  @Column({
    comment: '用户描述',
    default: '',
  })
  desc: string;

  @Column({
    comment: '手机号码',
    nullable: true,
  })
  tel: string;

  @Column({
    comment: '短信验证码',
    nullable: true,
  })
  smsCode: string;

  @Column({
    comment: '短信验证码创建时间',
    nullable: true,
  })
  smsCodeCreatedAt: Date;

  @Column({
    comment: '密码',
    nullable: true,
  })
  password: string;

  @Column({
    comment: '账户信息',
    nullable: true,
  })
  account: string;
}
