import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { OrderStatus } from './const';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    createdBy: string,
  ): Promise<[Order[], number]> {
    const where: FindOptionsWhere<Order> = {
      createdBy: createdBy,
    };
    return this.orderRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getCount(
    studentId: string,
    productId: string,
    organizationId: string,
  ): Promise<number> {
    return this.orderRepository.count({
      where: {
        status: OrderStatus.SUCCESS,
        student: {
          id: studentId,
        },
        product: {
          id: productId,
        },
        organization: {
          id: organizationId,
        },
      },
    });
  }

  async findOne(id: string): Promise<Order> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async findOneByOutTradeNo(outTradeNo: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: { outTradeNo },
      relations: ['product.cards.course', 'student', 'organization', 'wxorder'],
    });
  }

  async create(dto: DeepPartial<Order>): Promise<Order> {
    return this.orderRepository.save(this.orderRepository.create(dto));
  }

  async update(id: string, dto: DeepPartial<Order>): Promise<Order> {
    const order = await this.findOne(id);
    if (!order) {
      return null;
    }
    Object.assign(order, dto);
    return this.orderRepository.save(order);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    console.log('remove', id, userId);
    const res = await this.orderRepository.update(id, {
      deletedBy: userId,
    });
    if (res.affected > 0) {
      const res2 = await this.orderRepository.softDelete(id);
      return res2.affected > 0;
    }
    return false;
  }
}
