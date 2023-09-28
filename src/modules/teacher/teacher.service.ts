import { Injectable } from '@nestjs/common';
import { Teacher } from './entities/teacher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    createdBy: string,
    name?: string,
  ): Promise<[Teacher[], number]> {
    const where: FindOptionsWhere<Teacher> = {
      createdBy: createdBy,
    };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    return this.teacherRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Teacher> {
    return this.teacherRepository.findOne({ where: { id } });
  }

  async create(dto: DeepPartial<Teacher>): Promise<Teacher> {
    return this.teacherRepository.save(this.teacherRepository.create(dto));
  }

  async update(id: string, dto: DeepPartial<Teacher>): Promise<Teacher> {
    const teacher = await this.findOne(id);
    if (!teacher) {
      return null;
    }
    Object.assign(teacher, dto);
    return this.teacherRepository.save(teacher);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    console.log('remove', id, userId);
    const res = await this.teacherRepository.update(id, {
      deletedBy: userId,
    });
    if (res.affected > 0) {
      const res2 = await this.teacherRepository.softDelete(id);
      return res2.affected > 0;
    }
    return false;
  }
}
