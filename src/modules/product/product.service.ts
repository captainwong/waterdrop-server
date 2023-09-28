import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    createdBy: string,
    name?: string,
  ): Promise<[Product[], number]> {
    const where: FindOptionsWhere<Product> = {
      createdBy: createdBy,
    };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    return this.productRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
      relations: ['cards', 'organization'],
    });
  }

  async findOne(id: string): Promise<Product> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['cards.course', 'organization'],
    });
  }

  async create(dto: DeepPartial<Product>): Promise<Product> {
    return this.productRepository.save(this.productRepository.create(dto));
  }

  async update(id: string, dto: DeepPartial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      return null;
    }
    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    console.log('remove', id, userId);
    const res = await this.productRepository.update(id, {
      deletedBy: userId,
    });
    if (res.affected > 0) {
      const res2 = await this.productRepository.softDelete(id);
      return res2.affected > 0;
    }
    return false;
  }
}
