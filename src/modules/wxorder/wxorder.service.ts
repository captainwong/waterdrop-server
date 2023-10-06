import { Injectable } from '@nestjs/common';
import { Wxorder } from './entities/wxorder.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class WxorderService {
  constructor(
    @InjectRepository(Wxorder)
    private readonly wxorderRepository: Repository<Wxorder>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    createdBy: string,
  ): Promise<[Wxorder[], number]> {
    const where: FindOptionsWhere<Wxorder> = {
      createdBy: createdBy,
    };
    return this.wxorderRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Wxorder> {
    return this.wxorderRepository.findOne({ where: { id } });
  }

  async findOneByTransactionId(transactionId: string): Promise<Wxorder> {
    return this.wxorderRepository.findOne({
      where: { transaction_id: transactionId },
    });
  }

  async create(dto: DeepPartial<Wxorder>): Promise<Wxorder> {
    return this.wxorderRepository.save(this.wxorderRepository.create(dto));
  }

  async update(id: string, dto: DeepPartial<Wxorder>): Promise<Wxorder> {
    const wxorder = await this.findOne(id);
    if (!wxorder) {
      return null;
    }
    Object.assign(wxorder, dto);
    return this.wxorderRepository.save(wxorder);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    console.log('remove', id, userId);
    const res = await this.wxorderRepository.update(id, {
      deletedBy: userId,
    });
    if (res.affected > 0) {
      const res2 = await this.wxorderRepository.softDelete(id);
      return res2.affected > 0;
    }
    return false;
  }
}
