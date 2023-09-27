import { Injectable } from '@nestjs/common';
import { Card } from './entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async findAll(
    createdBy: string,
    organizationId: string,
    courseId: string,
    name?: string,
  ): Promise<Card[]> {
    const where: FindOptionsWhere<Card> = {
      createdBy: createdBy,
      organization: {
        id: organizationId,
      },
      course: {
        id: courseId,
        organization: {
          id: organizationId,
        },
      },
    };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    const [cards] = await this.cardRepository.findAndCount({
      where,
      order: {
        createdAt: 'ASC',
      },
    });
    return cards;
  }

  async findOne(
    id: string,
    createdBy: string,
    organizationId: string,
    courseId: string,
  ): Promise<Card> {
    return this.cardRepository.findOne({
      where: {
        id,
        createdBy,
        course: { id: courseId, organization: { id: organizationId } },
        organization: { id: organizationId },
      },
      relations: ['course'],
    });
  }

  async create(dto: DeepPartial<Card>): Promise<Card> {
    return this.cardRepository.save(this.cardRepository.create(dto));
  }

  async update(
    id: string,
    createdBy: string,
    organizationId: string,
    courseId: string,
    dto: DeepPartial<Card>,
  ): Promise<Card> {
    const card = await this.findOne(id, createdBy, organizationId, courseId);
    if (!card) {
      return null;
    }
    Object.assign(card, { ...dto, updatedBy: createdBy });
    return this.cardRepository.save(card);
  }

  async remove(
    id: string,
    createdBy: string,
    organizationId: string,
    courseId: string,
  ): Promise<boolean> {
    const card = await this.cardRepository.findOne({
      where: {
        id,
        createdBy,
        course: {
          id: courseId,
          organization: {
            id: organizationId,
          },
        },
        organization: {
          id: organizationId,
        },
      },
    });
    if (!card) {
      return false;
    }
    card.deletedBy = createdBy;
    card.deletedAt = new Date();
    await this.cardRepository.save(card);
    return true;
  }
}
