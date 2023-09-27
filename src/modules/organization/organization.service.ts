import { Injectable } from '@nestjs/common';
import { Organization } from './entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Like, Repository } from 'typeorm';
import { OrganizationImage } from './entities/organization-image.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationImage)
    private readonly imgRepository: Repository<OrganizationImage>,
  ) {}

  async create(dto: DeepPartial<Organization>): Promise<Organization> {
    return this.organizationRepository.save(
      this.organizationRepository.create(dto),
    );
  }

  async findOne(id: string, createdBy: string): Promise<Organization> {
    return this.organizationRepository.findOne({
      where: { id, createdBy },
      relations: ['frontImgs', 'roomImgs', 'otherImgs'],
    });
  }

  async findAll(
    page: number,
    pageSize: number,
    createdBy: string,
    name?: string,
  ): Promise<[Organization[], number]> {
    const where: FindOptionsWhere<Organization> = {
      createdBy,
    };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    return this.organizationRepository.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
      relations: ['frontImgs', 'roomImgs', 'otherImgs'],
    });
  }

  async update(
    id: string,
    createdBy: string,
    dto: DeepPartial<Organization>,
  ): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: {
        id,
        createdBy: createdBy,
      },
    });
    if (!organization) {
      return null;
    }
    await this.deleteImgsByOrgId(id);
    Object.assign(organization, { ...dto, updatedBy: createdBy });
    return this.organizationRepository.save(organization);
  }

  async remove(id: string, createdBy: string): Promise<boolean> {
    const organization = await this.organizationRepository.findOne({
      where: {
        id,
        createdBy,
      },
    });
    if (!organization) {
      return false;
    }
    await this.deleteImgsByOrgId(id);
    organization.deletedBy = createdBy;
    organization.deletedAt = new Date();
    await this.organizationRepository.save(organization);
    return true;
  }

  // always return true
  async deleteImgsByOrgId(orgId: string): Promise<boolean> {
    const imgs = await this.imgRepository
      .createQueryBuilder('imgs')
      .select('imgs.id')
      .where('imgs.frontImgsForOrgId = :orgId', { orgId })
      .orWhere('imgs.roomImgsForOrgId = :orgId', { orgId })
      .orWhere('imgs.otherImgsForOrgId = :orgId', { orgId })
      .getMany();
    if (imgs && imgs.length > 0) {
      await this.imgRepository.remove(imgs);
    }
    return true;
  }
}
