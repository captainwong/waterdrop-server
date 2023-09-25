import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UpdateOrganizationDto } from './dto/organization/update-organization.dto';
import { CurrentUserId } from '@/common/decorators/current-user.decorator';
import {
  OrganizationResult,
  OrganizationResults,
} from './dto/organization/organization-result';
import {
  CREATE_ORGANIZATION_FAILED,
  ORGANIZATION_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { CreateOrganizationDto } from './dto/organization/create-organization.dto';
import { CodeMsg } from '@/common/const/message';
import { Result } from '@/common/dto/result.dto';
import { Entity } from '@/common/decorators/entity.decorator';
import { EntityGuard } from '@/common/guards/entity.guard';

@Entity('user')
@UseGuards(GqlAuthGuard, EntityGuard)
@Resolver()
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Mutation(() => OrganizationResult, { description: 'Create organization' })
  async createOrUpdateOrganization(
    @CurrentUserId('userId') userId: string,
    @Args('dto') dto: CreateOrganizationDto,
    @Args('id', { nullable: true }) id?: string,
  ): Promise<OrganizationResult> {
    console.log('createOrUpdateOrganization', userId, id);
    if (!id) {
      const organization = await this.organizationService.create({
        ...dto,
        createdBy: userId,
      });
      return organization
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: organization }
        : {
            code: CREATE_ORGANIZATION_FAILED,
            message: CodeMsg(CREATE_ORGANIZATION_FAILED),
          };
    } else {
      const organization = await this.organizationService.update(id, {
        ...dto,
        updatedBy: userId,
      });
      return organization
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: organization }
        : {
            code: ORGANIZATION_NOT_EXISTS,
            message: CodeMsg(ORGANIZATION_NOT_EXISTS),
          };
    }
  }

  @Query(() => OrganizationResult, { description: 'Find organization by id' })
  async getOrganizationInfo(
    @Args('id') id: string,
  ): Promise<OrganizationResult> {
    const organization = await this.organizationService.findOne(id);
    return organization
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: organization }
      : { code: ORGANIZATION_NOT_EXISTS, message: 'Organization not exists' };
  }

  @Query(() => OrganizationResults, { description: 'Find organizations' })
  async getOrganizations(
    @CurrentUserId('userId') userId: string,
    @Args('page') pageInput: PageInput,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<OrganizationResults> {
    const { page, pageSize } = pageInput;
    const [organizations, total] = await this.organizationService.findAll(
      page,
      pageSize,
      userId,
      name,
    );
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: organizations,
      page: {
        page,
        pageSize,
        total,
      },
    };
  }

  @Mutation(() => Result, { description: 'Delete organization by id' })
  async deleteOrganization(
    @CurrentUserId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteOrganization', id, userId);
    const res = await this.organizationService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: ORGANIZATION_NOT_EXISTS,
          message: CodeMsg(ORGANIZATION_NOT_EXISTS),
        };
  }
}
