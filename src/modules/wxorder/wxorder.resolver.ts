import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WxorderService } from './wxorder.service';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
import { WxorderResult, WxorderResults } from './dto/wxorder-result';
import { WXORDER_NOT_EXISTS, SUCCESS } from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { Result } from '@/common/dto/result.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';

@TokenEntity('student')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class WxorderResolver {
  constructor(private readonly wxorderService: WxorderService) {}

  @Query(() => WxorderResult, { description: 'Find wxorder by id' })
  async getWxorderInfo(@Args('id') id: string): Promise<WxorderResult> {
    const wxorder = await this.wxorderService.findOne(id);
    return wxorder
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: wxorder }
      : { code: WXORDER_NOT_EXISTS, message: CodeMsg(WXORDER_NOT_EXISTS) };
  }

  // @Query(() => WxorderResults, { description: 'Find wxorders' })
  // async getWxorders(
  //   @CurrentGqlTokenId('studentId') studentId: string,
  //   @Args('page') pageInput: PageInput,
  // ): Promise<WxorderResults> {
  //   const { page, pageSize } = pageInput;
  //   const [wxorders, total] = await this.wxorderService.findAll(
  //     page,
  //     pageSize,
  //     studentId,
  //   );
  //   return {
  //     code: SUCCESS,
  //     message: CodeMsg(SUCCESS),
  //     data: wxorders,
  //     page: {
  //       page,
  //       pageSize,
  //       total,
  //     },
  //   };
  // }

  @Mutation(() => Result, { description: 'Delete wxorder by id' })
  async deleteWxorder(
    @CurrentGqlTokenId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteWxorder', id, userId);
    const res = await this.wxorderService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: WXORDER_NOT_EXISTS,
          message: CodeMsg(WXORDER_NOT_EXISTS),
        };
  }
}
