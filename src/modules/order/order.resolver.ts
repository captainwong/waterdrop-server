import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
import { OrderResult, OrderResults } from './dto/order-result';
import { ORDER_NOT_EXISTS, SUCCESS } from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { Result } from '@/common/dto/result.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';

@TokenEntity('student')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => OrderResult, { description: 'Find order by id' })
  async getOrderInfo(@Args('id') id: string): Promise<OrderResult> {
    const order = await this.orderService.findOne(id);
    return order
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: order }
      : { code: ORDER_NOT_EXISTS, message: CodeMsg(ORDER_NOT_EXISTS) };
  }

  @Query(() => OrderResults, { description: 'Find orders' })
  async getOrders(
    @CurrentGqlTokenId('studentId') studentId: string,
    @Args('page') pageInput: PageInput,
  ): Promise<OrderResults> {
    const { page, pageSize } = pageInput;
    const [orders, total] = await this.orderService.findAll(
      page,
      pageSize,
      studentId,
    );
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: orders,
      page: {
        page,
        pageSize,
        total,
      },
    };
  }

  @Mutation(() => Result, { description: 'Delete order by id' })
  async deleteOrder(
    @CurrentGqlTokenId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteOrder', id, userId);
    const res = await this.orderService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: ORDER_NOT_EXISTS,
          message: CodeMsg(ORDER_NOT_EXISTS),
        };
  }
}
