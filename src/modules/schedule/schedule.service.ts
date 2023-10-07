import { Injectable } from '@nestjs/common';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(
    day: Date,
    page: number,
    pageSize: number,
    organizationId: string,
  ): Promise<[Schedule[], number]> {
    const where: FindOptionsWhere<Schedule> = {
      date: day,
      organization: {
        id: organizationId,
      },
    };
    return this.scheduleRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // find conflict schedules count by course id, date,
  // and time in between of the beginTime and endTime
  async findConflictCount(
    courseId: string,
    date: Date,
    start: string,
    end: string,
  ): Promise<number> {
    const where: FindOptionsWhere<Schedule> = {
      course: {
        id: courseId,
      },
      date: date,
      start: Between(start, end),
      end: Between(start, end),
    };
    return this.scheduleRepository.count({
      where,
    });
  }

  async findOne(id: string): Promise<Schedule> {
    return this.scheduleRepository.findOne({ where: { id } });
  }

  async createInstance(dto: DeepPartial<Schedule>): Promise<Schedule> {
    return this.scheduleRepository.create(dto);
  }

  async saveInstances(schedules: Schedule[]): Promise<Schedule[]> {
    return this.scheduleRepository.save(schedules);
  }

  async create(dto: DeepPartial<Schedule>): Promise<Schedule> {
    return this.scheduleRepository.save(this.scheduleRepository.create(dto));
  }

  async update(id: string, dto: DeepPartial<Schedule>): Promise<Schedule> {
    const schedule = await this.findOne(id);
    if (!schedule) {
      return null;
    }
    Object.assign(schedule, dto);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    console.log('remove', id, userId);
    const res = await this.scheduleRepository.update(id, {
      deletedBy: userId,
    });
    if (res.affected > 0) {
      const res2 = await this.scheduleRepository.softDelete(id);
      return res2.affected > 0;
    }
    return false;
  }
}
