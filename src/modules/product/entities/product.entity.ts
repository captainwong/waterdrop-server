import { ProductStatus } from '@/common/const/enum';
import { CommonEntity } from '@/common/entities/common.entity';
import { Card } from '@/modules/card/entities/card.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('products')
export class Product extends CommonEntity {
  @Column({
    comment: '名称',
  })
  @IsNotEmpty()
  name: string;

  @Column({
    comment: '描述',
    nullable: true,
  })
  desc: string;

  @Column({
    comment: '分类',
    nullable: true,
  })
  category: string;

  @Column({
    comment: '状态',
    default: ProductStatus.ON_SAIL,
  })
  @IsNotEmpty()
  status: string;

  @Column({
    comment: '库存',
    default: 0,
  })
  stock: number;

  @Column({
    comment: '销量',
    default: 0,
  })
  sales: number;

  @Column({
    comment: '限购',
    default: -1,
  })
  limit: number;

  @Column({
    comment: '价格',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: string;

  @Column({
    comment: '原价',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  originalPrice: string;

  @Column({
    comment: '封面',
  })
  @IsNotEmpty()
  cover: string;

  @Column({
    comment: 'banner',
  })
  @IsNotEmpty()
  banner: string;

  @ManyToOne(() => Organization, (organization) => organization.products, {
    cascade: true,
  })
  organization: Organization;

  @ManyToMany(() => Card, { cascade: true })
  @JoinTable({
    name: 'product_cards',
  })
  cards: Card[];
}
