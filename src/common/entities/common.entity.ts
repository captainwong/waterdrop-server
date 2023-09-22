import { IsDate, IsOptional, validateOrReject } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', comment: 'Creation time' })
  createdAt: Date;

  @Column({ nullable: true, comment: 'Created by' })
  @IsOptional()
  createdBy?: string;

  @Column({ type: 'timestamp', nullable: true, comment: 'Modification time' })
  updatedAt: Date;

  @Column({ nullable: true, comment: 'Modified by' })
  @IsOptional()
  updatedBy?: string;

  @Column({ type: 'timestamp', nullable: true, comment: 'Deletion time' })
  @DeleteDateColumn()
  @IsDate()
  @IsOptional()
  deletedAt: Date;

  @Column({ nullable: true, comment: 'Deleted by' })
  @IsOptional()
  deletedBy: string;

  @BeforeInsert()
  setCreatedAt() {
    const now = new Date();
    this.createdAt = new Date();
    this.updatedAt = now;
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  async validateBeforeInsert() {
    await validateOrReject(this);
  }

  @BeforeUpdate()
  async validateBeforeUpdate() {
    await validateOrReject(this, { skipMissingProperties: true });
  }
}
