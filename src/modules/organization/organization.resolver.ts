import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { CurrentTokenId } from '@/common/decorators/current-token-id.decorator';
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
import { OrganizationInputDto } from './dto/organization/organization-input.dto';
import { CodeMsg } from '@/common/const/message';
import { Result } from '@/common/dto/result.dto';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';

@TokenEntity('user')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Mutation(() => OrganizationResult, { description: 'Create organization' })
  async createOrUpdateOrganization(
    @CurrentTokenId('userId') userId: string,
    @Args('dto') dto: OrganizationInputDto,
    @Args('id', { nullable: true }) id?: string,
  ): Promise<OrganizationResult> {
    console.log('createOrUpdateOrganization', { userId, id });
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
      const organization = await this.organizationService.update(
        id,
        userId,
        dto,
      );
      return organization
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: organization }
        : {
            code: ORGANIZATION_NOT_EXISTS,
            message: CodeMsg(ORGANIZATION_NOT_EXISTS),
          };
    }
  }

  @TokenEntity('student')
  @Query(() => OrganizationResult, { description: 'Find organization by id' })
  async getOrganizationInfo(
    @Args('id') id: string,
  ): Promise<OrganizationResult> {
    console.log('getOrganizationInfo', { id });
    const organization = await this.organizationService.findOne(id);
    return organization
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: organization }
      : { code: ORGANIZATION_NOT_EXISTS, message: 'Organization not exists' };
  }

  @Query(() => OrganizationResults, { description: 'Find organizations' })
  async getOrganizations(
    @CurrentTokenId('userId') userId: string,
    @Args('page') pageInput: PageInput,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<OrganizationResults> {
    console.log('getOrganizations', { userId, pageInput, name });
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
    @CurrentTokenId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteOrganization', { userId, id });
    const res = await this.organizationService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: ORGANIZATION_NOT_EXISTS,
          message: CodeMsg(ORGANIZATION_NOT_EXISTS),
        };
  }
}
