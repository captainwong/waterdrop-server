import { Injectable } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CourseInputDto } from './dto/course-input.dto';

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
    name?: string,
  ): Promise<[Course[], number]> {
    const where: FindOptionsWhere<Course> = {
      createdBy: createdBy,
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

  async create(dto: CourseInputDto): Promise<Course> {
    return this.courseRepository.save(this.courseRepository.create(dto));
  }

  async update(id: string, dto: CourseInputDto): Promise<Course> {
    const course = await this.findOne(id);
    if (!course) {
      return null;
    }
    Object.assign(course, dto);
    return this.courseRepository.save(course);
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
