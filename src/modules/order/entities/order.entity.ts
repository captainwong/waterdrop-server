import { CommonEntity } from '@/common/entities/common.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { Product } from '@/modules/product/entities/product.entity';
import { Student } from '@/modules/student/entities/student.entity';
import { Wxorder } from '@/modules/wxorder/entities/wxorder.entity';
import { Column, Entity, Index, ManyToOne, OneToOne } from 'typeorm';

@Entity('orders')
export class Order extends CommonEntity {
  @Column({
    comment: '订单号',
    default: '',
  })
  @Index()
  outTradeNo: string;

  @Column({
    comment: '手机号',
    nullable: true,
  })
  tel: string;

  @Column({
    comment: '数量',
    nullable: true,
  })
  quantity: number;

  @Column({
    comment: '总金额',
    nullable: true,
  })
  amount: number;

  @Column({
    comment: '支付状态',
    nullable: true,
  })
  status: string;

  @ManyToOne(() => Organization, {
    cascade: true,
  })
  organization: Organization;

  @ManyToOne(() => Product, {
    cascade: true,
  })
  product: Product;

  @ManyToOne(() => Student, {
    cascade: true,
  })
  student: Student;

  @OneToOne(() => Wxorder, (wxorder) => wxorder.order, { cascade: true })
  wxorder?: Wxorder;
}
