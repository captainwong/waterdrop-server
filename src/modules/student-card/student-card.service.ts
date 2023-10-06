import { Injectable } from '@nestjs/common';
import { StudentCard } from './entities/student-card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class StudentCardService {
  constructor(
    @InjectRepository(StudentCard)
    private readonly studentRecordRepository: Repository<StudentCard>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    createdBy: string,
  ): Promise<[StudentCard[], number]> {
    const where: FindOptionsWhere<StudentCard> = {
      createdBy: createdBy,
    };
    return this.studentRecordRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<StudentCard> {
    return this.studentRecordRepository.findOne({ where: { id } });
  }

  async create(dto: DeepPartial<StudentCard>): Promise<StudentCard> {
    return this.studentRecordRepository.save(
      this.studentRecordRepository.create(dto),
    );
  }

  async update(
    id: string,
    dto: DeepPartial<StudentCard>,
  ): Promise<StudentCard> {
    const studentRecord = await this.findOne(id);
    if (!studentRecord) {
      return null;
    }
    Object.assign(studentRecord, dto);
    return this.studentRecordRepository.save(studentRecord);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    console.log('remove', id, userId);
    const res = await this.studentRecordRepository.update(id, {
      deletedBy: userId,
    });
    if (res.affected > 0) {
      const res2 = await this.studentRecordRepository.softDelete(id);
      return res2.affected > 0;
    }
    return false;
  }
}
