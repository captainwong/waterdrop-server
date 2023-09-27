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

  async findOne(
    id: string,
    createdBy: string,
    organizationId: string,
  ): Promise<Course> {
    return this.courseRepository.findOne({
      where: { id, createdBy, organization: { id: organizationId } },
    });
  }

  async create(
    createdBy: string,
    organizationId: string,
    dto: DeepPartial<Course>,
  ): Promise<Course> {
    return this.courseRepository.save(
      this.courseRepository.create({
        ...dto,
        createdBy,
        organization: { id: organizationId },
      }),
    );
  }

  async update(
    id: string,
    createdBy: string,
    organizationId: string,
    dto: DeepPartial<Course>,
  ): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: {
        id,
        createdBy,
        organization: {
          id: organizationId,
        },
      },
    });
    if (!course) {
      return null;
    }
    Object.assign(course, { ...dto, updatedBy: createdBy });
    return this.courseRepository.save(course);
  }

  async remove(
    id: string,
    createdBy: string,
    organizationId: string,
  ): Promise<boolean> {
    const course = await this.courseRepository.findOne({
      where: {
        id,
        createdBy,
        organization: {
          id: organizationId,
        },
      },
    });
    if (!course) {
      return false;
    }
    course.deletedBy = createdBy;
    course.deletedAt = new Date();
    await this.courseRepository.save(course);
    return true;
  }
}
