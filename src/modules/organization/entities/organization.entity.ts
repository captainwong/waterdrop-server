import { CommonEntity } from '@/common/entities/common.entity';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrganizationImage } from './organization-image.entity';
import { Course } from '@/modules/course/entities/course.entity';
import { Card } from '@/modules/card/entities/card.entity';

@Entity('organizations')
export class Organization extends CommonEntity {
  @Column({
    comment: '营业执照',
  })
  @IsNotEmpty()
  businessLicense: string;

  @Column({
    comment: '法人身份证正面',
  })
  @IsNotEmpty()
  identityCardFrontImg: string;

  @Column({
    comment: '法人身份证反面',
  })
  @IsNotEmpty()
  identityCardBackImg: string;

  @Column({
    type: 'text',
    comment: '标签，以英文,隔开',
    nullable: true,
  })
  tags: string;

  @Column({
    type: 'text',
    comment: '简介',
    nullable: true,
  })
  desc: string;

  @Column({
    comment: '机构名称',
    nullable: true,
    default: '',
  })
  name: string;

  @Column({
    comment: '机构电话',
    nullable: true,
  })
  tel: string;

  @Column({
    comment: '机构地址',
    nullable: true,
  })
  address: string;

  @Column({
    comment: '经度',
    nullable: true,
  })
  longitude: string;

  @Column({
    comment: '纬度',
    nullable: true,
  })
  latitude: string;

  @Column({
    comment: 'Logo',
    nullable: true,
  })
  logo: string;

  @OneToMany(() => OrganizationImage, (img) => img.frontImgsForOrg, {
    cascade: true,
  })
  frontImgs?: OrganizationImage[];

  @OneToMany(() => OrganizationImage, (img) => img.roomImgsForOrg, {
    cascade: true,
  })
  roomImgs?: OrganizationImage[];

  @OneToMany(() => OrganizationImage, (img) => img.otherImgsForOrg, {
    cascade: true,
  })
  otherImgs?: OrganizationImage[];

  @OneToMany(() => Course, (course) => course.organization)
  courses?: Course[];

  @OneToMany(() => Card, (card) => card.organization)
  cards: Card[];
}
