import { Injectable } from '@nestjs/common';
import { StudentCard } from './entities/student-card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsWhere,
  LessThan,
  Not,
  Repository,
} from 'typeorm';
import { Card } from '../card/entities/card.entity';
import dayjs from 'dayjs';
import { CardType } from '@/common/const/enum';

@Injectable()
export class StudentCardService {
  constructor(
    @InjectRepository(StudentCard)
    private readonly studentCardRepository: Repository<StudentCard>,
  ) {}

  // 为学生生成对应商品的消费卡
  async createStudentCards(
    organizationId: string,
    studentId: string,
    cards: Card[],
  ): Promise<boolean> {
    const studentCards = cards.map((card) => {
      const now = dayjs();
      return this.studentCardRepository.create({
        student: {
          id: studentId,
        },
        card: {
          id: card.id,
        },
        course: {
          id: card.course.id,
        },
        organization: {
          id: organizationId,
        },
        purchasedAt: now.toDate(),
        effectiveAt: now.toDate(),
        expiresAt: now.add(card.duration, 'day').toDate(),
        type: card.type,
        remainingTimes: card.type === CardType.COUNT ? card.count : 0,
      });
    });
    const res = await this.studentCardRepository.save(studentCards);
    return res.length > 0;
  }

  async findAll(
    page: number,
    pageSize: number,
    studentId: string,
  ): Promise<[StudentCard[], number]> {
    const where: FindOptionsWhere<StudentCard> = {
      student: { id: studentId },
    };
    return this.studentCardRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
      relations: ['card', 'organization', 'course'],
    });
  }

  async findOne(id: string, stduentId?: string): Promise<StudentCard> {
    const where: FindOptionsWhere<StudentCard> = {
      id,
    };
    if (stduentId) {
      where.student = { id: stduentId };
    }
    return this.studentCardRepository.findOne({ where });
  }

  async create(dto: DeepPartial<StudentCard>): Promise<StudentCard> {
    return this.studentCardRepository.save(
      this.studentCardRepository.create(dto),
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
    return this.studentCardRepository.save(studentRecord);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    console.log('remove', id, userId);
    const res = await this.studentCardRepository.update(id, {
      deletedBy: userId,
    });
    if (res.affected > 0) {
      const res2 = await this.studentCardRepository.softDelete(id);
      return res2.affected > 0;
    }
    return false;
  }

  async findValidCardsForStudent(
    studentId: string,
    courseId?: string,
  ): Promise<StudentCard[]> {
    const now = dayjs();
    const where: FindOptionsWhere<StudentCard> = {
      student: { id: studentId },
      effectiveAt: LessThan(now.toDate()),
      expiresAt: Not(LessThan(now.toDate())),
    };
    if (courseId) {
      where.course = { id: courseId };
    }
    const cards = await this.studentCardRepository.find({
      where,
      relations: ['card', 'course.organization'],
      order: {
        effectiveAt: 'ASC',
      },
    });
    return cards.filter((card) => {
      if (card.type === CardType.COUNT) {
        return card.remainingTimes > 0;
      }
      return true;
    });
  }
}
