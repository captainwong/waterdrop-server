import { Injectable } from '@nestjs/common';
import { Student } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentInputDto } from './dto/student-input.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async findAll(
    createdBy: string,
    {
      page,
      pageSize,
    }: {
      page: number;
      pageSize: number;
    },
  ): Promise<[Student[], number]> {
    return this.studentRepository.findAndCount({
      where: {
        createdBy,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Student> {
    return this.studentRepository.findOne({ where: { id } });
  }

  async findOneByAccount(account: string): Promise<Student> {
    return this.studentRepository.findOne({
      where: { account: account },
    });
  }

  async create(dto: StudentInputDto): Promise<Student> {
    return this.studentRepository.save(this.studentRepository.create(dto));
  }

  async update(id: string, dto: StudentInputDto): Promise<boolean> {
    const res = await this.studentRepository.update(id, dto);
    return res.affected > 0;
  }
}
