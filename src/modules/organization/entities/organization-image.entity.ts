import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';

@Entity('organization_images')
export class OrganizationImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    comment: 'url',
  })
  url: string;

  @Column({
    comment: 'remark',
    nullable: true,
  })
  remark: string;

  @ManyToOne(() => Organization, (org) => org.frontImgs)
  frontImgsForOrg: Organization;

  @ManyToOne(() => Organization, (org) => org.roomImgs)
  roomImgsForOrg: Organization;

  @ManyToOne(() => Organization, (org) => org.otherImgs)
  otherImgsForOrg: Organization;
}
