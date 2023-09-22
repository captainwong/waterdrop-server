import { CommonEntity } from '@/common/entities/common.entity';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class User extends CommonEntity {
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
    comment: '账户信息',
    nullable: true,
  })
  account: string;

  @Column({
    comment: '密码',
    nullable: true,
  })
  password: string;

  @Column({
    comment: '用户头像',
    nullable: true,
  })
  avatar: string;
}
