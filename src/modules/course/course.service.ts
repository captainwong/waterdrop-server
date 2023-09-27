import { Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    createdBy: string,
    organizationId: string,
    name?: string,
  ): Promise<[Course[], number]> {
    const where: FindOptionsWhere<Course> = {
      createdBy: createdBy,
      organization: {
        id: organizationId,
      },
    };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    return this.courseRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Course> {
    return this.courseRepository.findOne({ where: { id } });
  }

  async create(dto: DeepPartial<Course>): Promise<Course> {
    return this.courseRepository.save(this.courseRepository.create(dto));
  }

  async update(
    id: string,
    organizationId: string,
    dto: DeepPartial<Course>,
  ): Promise<Course> {
    const where: FindOptionsWhere<Course> = {
      id,
      organization: {
        id: organizationId,
      },
    };
    const [courses, total] = await this.courseRepository.findAndCount({
      where,
      take: 1,
    });
    if (total < 1) {
      return null;
    }
    Object.assign(courses[0], dto);
    return this.courseRepository.save(courses[0]);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    console.log('remove', id, userId);
    const res = await this.courseRepository.update(id, {
      deletedBy: userId,
    });
    if (res.affected > 0) {
      const res2 = await this.courseRepository.softDelete(id);
      return res2.affected > 0;
    }
    return false;
  }
}
