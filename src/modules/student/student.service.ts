import { Injectable } from '@nestjs/common';
import { Student } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async findAll({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<[Student[], number]> {
    return this.studentRepository.findAndCount({
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

  async create(dto: CreateStudentDto): Promise<Student> {
    return this.studentRepository.save(this.studentRepository.create(dto));
  }

  async update(id: string, dto: UpdateStudentDto): Promise<boolean> {
    const res = await this.studentRepository.update(id, dto);
    return res.affected > 0;
  }
}
