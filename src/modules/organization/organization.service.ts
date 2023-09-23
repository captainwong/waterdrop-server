import { Injectable } from '@nestjs/common';
import { Organization } from './entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/organization/create-organization.dto';
import { UpdateOrganizationDto } from './dto/organization/update-organization.dto';
import { OrganizationImage } from './entities/organization-image.entiry';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationImage)
    private readonly imgRepository: Repository<OrganizationImage>,
  ) {}

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationRepository.save(
      this.organizationRepository.create(dto),
    );
  }

  async findOne(id: string): Promise<Organization> {
    return this.organizationRepository.findOne({
      where: { id },
      relations: ['frontImgs', 'roomImgs', 'otherImgs'],
    });
  }

  async findAll({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<[Organization[], number]> {
    return this.organizationRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
      relations: ['frontImgs', 'roomImgs', 'otherImgs'],
    });
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.findOne(id);
    if (!organization) {
      return null;
    }

    await this.deleteImgsByOrgId(id);
    Object.assign(organization, dto);
    return this.organizationRepository.save(organization);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    console.log('remove', id, userId);
    const res = await this.organizationRepository.update(id, {
      deletedBy: userId,
    });
    if (res.affected > 0) {
      const res2 = await this.organizationRepository.softDelete(id);
      return res2.affected > 0;
    }
    return false;
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
