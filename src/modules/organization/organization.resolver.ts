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

@UseGuards(GqlAuthGuard)
@Resolver()
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Mutation(() => OrganizationResult, { description: 'Create organization' })
  async createOrganization(
    @CurrentUserId() userId: string,
    @Args('dto') dto: CreateOrganizationDto,
  ): Promise<OrganizationResult> {
    const organization = await this.organizationService.create({
      ...dto,
      createdBy: userId,
    });
    if (organization) {
      return { code: SUCCESS, message: CodeMsg(SUCCESS), data: organization };
    } else {
      return {
        code: CREATE_ORGANIZATION_FAILED,
        message: CodeMsg(CREATE_ORGANIZATION_FAILED),
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

  @Mutation(() => OrganizationResult, {
    description: 'Update organization by id',
  })
  async updateOrganizationInfo(
    @CurrentUserId() userId: string,
    @Args('id') id: string,
    @Args('dto') dto: UpdateOrganizationDto,
  ): Promise<OrganizationResult> {
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

  @Query(() => OrganizationResults, { description: 'Find organizations' })
  async getOrganizations(
    @Args('page') pageInput: PageInput,
  ): Promise<OrganizationResults> {
    const { page, pageSize } = pageInput;
    const [organizations, total] = await this.organizationService.findAll({
      page,
      pageSize,
    });
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
}
