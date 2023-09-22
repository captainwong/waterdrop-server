import { Injectable, NotFoundException } from '@nestjs/common';
import { Student } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from '@/common/dto/result.dto';
import { SUCCESS } from '@/common/const/code';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student #${id} not found`);
    }
    return student;
  }

  async findOneByAccount(account: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { account: account },
    });
    return student;
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    const student = await this.studentRepository.save(dto);
    return student;
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Result> {
    await this.studentRepository.update(id, dto);
    return {
      code: SUCCESS,
    };
  }
}
