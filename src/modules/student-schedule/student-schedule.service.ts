import { Injectable } from '@nestjs/common';
import { StudentSchedule } from './entities/student-schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class StudentScheduleService {
  constructor(
    @InjectRepository(StudentSchedule)
    private readonly studentScheduleRepository: Repository<StudentSchedule>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    studentId: string,
  ): Promise<[StudentSchedule[], number]> {
    const where: FindOptionsWhere<StudentSchedule> = {
      student: {
        id: studentId,
      },
    };
    return this.studentScheduleRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
      relations: ['schedule.teacher', 'course', 'organization'],
    });
  }

  async findOne(id: string): Promise<StudentSchedule> {
    return this.studentScheduleRepository.findOne({
      where: { id },
      relations: ['studentCard', 'schedule'],
    });
  }

  async isScheduleAlreadyReserved(
    scheduleId: string,
    studentId: string,
  ): Promise<boolean> {
    const count = await this.studentScheduleRepository.count({
      where: {
        schedule: { id: scheduleId },
        student: { id: studentId },
      },
    });
    return count > 0;
  }

  async create(dto: DeepPartial<StudentSchedule>): Promise<StudentSchedule> {
    return this.studentScheduleRepository.save(
      this.studentScheduleRepository.create(dto),
    );
  }

  async update(
    id: string,
    dto: DeepPartial<StudentSchedule>,
  ): Promise<StudentSchedule> {
    const studentSchedule = await this.findOne(id);
    if (!studentSchedule) {
      return null;
    }
    Object.assign(studentSchedule, dto);
    return this.studentScheduleRepository.save(studentSchedule);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    console.log('remove', id, userId);
    const res = await this.studentScheduleRepository.update(id, {
      deletedBy: userId,
    });
    if (res.affected > 0) {
      const res2 = await this.studentScheduleRepository.softDelete(id);
      return res2.affected > 0;
    }
    return false;
  }
}
