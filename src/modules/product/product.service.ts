import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { ProductStatus } from '@/common/const/enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    organizationId?: string,
    createdBy?: string,
    category?: string,
    name?: string,
    status?: string,
  ): Promise<[Product[], number]> {
    const where: FindOptionsWhere<Product> = {};
    if (organizationId) {
      where.organization = {
        id: organizationId,
      };
    }
    if (createdBy) {
      where.createdBy = createdBy;
    }
    if (category) {
      where.category = category;
    }
    if (name) {
      where.name = Like(`%${name}%`);
    }
    if (status) {
      where.status = status;
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

  async findAllByDistance(
    latitude: number,
    longitude: number,
    page: number,
    pageSize: number,
    organizationId?: string,
    createdBy?: string,
    category?: string,
    name?: string,
    status?: string,
  ) {
    const total = await this.productRepository
      .createQueryBuilder('products')
      .select('products')
      .where(
        organizationId
          ? `products.organizationId = '${organizationId}'`
          : '1=1',
      )
      .andWhere(createdBy ? `products.createdBy = '${createdBy}'` : '1=1')
      .andWhere(category ? `products.category = '${category}'` : '1=1')
      .andWhere(name ? `products.name like '%${name}%'` : '1=1')
      .andWhere(status ? `products.status = '${status}'` : '1=1')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getCount();

    const { entities, raw } = await this.productRepository
      .createQueryBuilder('products')
      .select('products')
      .addSelect(
        `ST_Distance(ST_GeomFromText('POINT(${latitude} ${longitude})', 4326), 
        ST_GeomFromText(CONCAT('POINT(', organizations.latitude, ' ', organizations.longitude, ')'), 4326))`,
        'distance',
      )
      .innerJoin('products.organization', 'organizations')
      .leftJoinAndSelect('products.cards', 'cards')
      .leftJoinAndSelect('products.organization', 'organization')
      .where(
        organizationId
          ? `products.organizationId = '${organizationId}'`
          : '1=1',
      )
      .andWhere(createdBy ? `products.createdBy = '${createdBy}'` : '1=1')
      .andWhere(category ? `products.category = '${category}'` : '1=1')
      .andWhere(name ? `products.name like '%${name}%'` : '1=1')
      .andWhere(status ? `products.status = '${status}'` : '1=1')
      .orderBy('distance', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawAndEntities();

    return { entities, raw, total };
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

  async incSalesDecStock(id: string, quantity: number): Promise<boolean> {
    const res = await this.productRepository.increment(
      { id },
      'sales',
      quantity,
    );
    if (res.affected > 0) {
      const res2 = await this.productRepository.decrement(
        { id },
        'stock',
        quantity,
      );
      return res2.affected > 0;
    }
    return false;
  }

  async batchUpdate(
    userId: string,
    organizationId: string,
    ids: string[],
    onSale: boolean,
  ): Promise<boolean> {
    const where: FindOptionsWhere<Product> = {
      createdBy: userId,
      organization: {
        id: organizationId,
      },
      id: In(ids),
    };
    const res = await this.productRepository.update(where, {
      status: onSale ? ProductStatus.ON_SAIL : ProductStatus.NOT_FOR_SAIL,
    });
    return res.affected > 0;
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
