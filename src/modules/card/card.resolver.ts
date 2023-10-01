import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { CardInputDto } from './dto/card-input.dto';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
import { CardResult, CardResults } from './dto/card-result';
import {
  CREATE_CARD_FAILED,
  CARD_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { Result } from '@/common/dto/result.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { CurrentOrganizationId } from '@/common/decorators/current-organization.decorator';
import { CardType } from '@/common/const/enum';

@TokenEntity('user')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Mutation(() => CardResult, { description: 'Create card' })
  async createOrUpdateCard(
    @CurrentGqlTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('courseId') courseId: string,
    @Args('dto') dto: CardInputDto,
    @Args('id', { nullable: true }) id?: string,
  ): Promise<CardResult> {
    console.log('createOrUpdateCard', { userId, organizationId, courseId, id });
    if (dto.type !== CardType.COUNT) {
      dto.count = 0;
    }
    if (!id) {
      const card = await this.cardService.create({
        ...dto,
        createdBy: userId,
        course: {
          id: courseId,
        },
        organization: {
          id: organizationId,
        },
      });
      return card
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: card }
        : {
            code: CREATE_CARD_FAILED,
            message: CodeMsg(CREATE_CARD_FAILED),
          };
    } else {
      const card = await this.cardService.update(
        id,
        userId,
        organizationId,
        courseId,
        dto,
      );
      return card
        ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: card }
        : {
            code: CARD_NOT_EXISTS,
            message: CodeMsg(CARD_NOT_EXISTS),
          };
    }
  }

  @Query(() => CardResult, { description: 'Find card by id' })
  async getCardInfo(
    @CurrentGqlTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('courseId') courseId: string,
    @Args('id') id: string,
  ): Promise<CardResult> {
    console.log('getCardInfo', { userId, organizationId, courseId, id });
    const card = await this.cardService.findOne(
      id,
      userId,
      organizationId,
      courseId,
    );
    return card
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: card }
      : { code: CARD_NOT_EXISTS, message: CodeMsg(CARD_NOT_EXISTS) };
  }

  @Query(() => CardResults, { description: 'Find cards' })
  async getCards(
    @CurrentGqlTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('courseId') courseId: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<CardResults> {
    console.log('getCards', { userId, organizationId, courseId, name });
    const cards = await this.cardService.findAll(
      userId,
      organizationId,
      courseId,
      name,
    );
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: cards,
    };
  }

  @Mutation(() => Result, { description: 'Delete organization by id' })
  async deleteCard(
    @CurrentGqlTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('courseId') courseId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteCard', { id, userId, organizationId, courseId });
    const res = await this.cardService.remove(
      id,
      userId,
      organizationId,
      courseId,
    );
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: CARD_NOT_EXISTS,
          message: CodeMsg(CARD_NOT_EXISTS),
        };
  }
}
