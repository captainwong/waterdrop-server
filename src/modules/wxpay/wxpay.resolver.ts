import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StudentService } from '../student/student.service';
import { ProductService } from '../product/product.service';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { WxpayConfigResult } from './dto/wxpay-result.type';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
import { CodeMsg } from '@/common/const/message';
import {
  PRODUCT_NOT_ENOUGH,
  PRODUCT_NOT_EXISTS,
  STUDENT_NOT_EXISTS,
} from '@/common/const/code';

@TokenEntity('student')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class WxpayResolver {
  constructor(
    private readonly studentService: StudentService,
    private readonly productService: ProductService,
  ) {}

  @Mutation(() => WxpayConfigResult, { description: '获取微信支付配置' })
  async wxpayConfig(
    @CurrentGqlTokenId('studentId') studentId: string,
    @Args('productId') productId: string,
    @Args('quantity') quantity: number,
    @Args('amount') amount: number, // 单位：分
  ): Promise<WxpayConfigResult> {
    const student = await this.studentService.findOne(studentId);
    const product = await this.productService.findOne(productId);

    if (!student) {
      return {
        code: STUDENT_NOT_EXISTS,
        message: CodeMsg(STUDENT_NOT_EXISTS),
      };
    }

    if (!product) {
      return {
        code: PRODUCT_NOT_EXISTS,
        message: CodeMsg(PRODUCT_NOT_EXISTS),
      };
    }

    // TODO: 限购

    // 库存
    if (product.stock < quantity) {
      return {
        code: PRODUCT_NOT_ENOUGH,
        message: CodeMsg(PRODUCT_NOT_ENOUGH),
      };
    }
  }
}
