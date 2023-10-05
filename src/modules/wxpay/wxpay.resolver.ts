import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StudentService } from '../student/student.service';
import { ProductService } from '../product/product.service';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { Inject, Req, UseGuards } from '@nestjs/common';
import { WxpayConfigResult } from './dto/wxpay-result.type';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
import { CodeMsg } from '@/common/const/message';
import {
  INVALID_PARAMS,
  NOT_IMPLEMENTED_YET,
  PRODUCT_LIMIT,
  PRODUCT_NOT_ENOUGH,
  PRODUCT_NOT_EXISTS,
  STUDENT_HAS_NO_OPENID,
  STUDENT_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import WxPay from 'wechatpay-node-v3';
import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3';
import { v4 as uuid } from 'uuid';
import { SCENES } from './const';
import { createCodeMsgResult } from '@/common/dto/result.dto';
import { WxorderService } from '../wxorder/wxorder.service';
import { OrderService } from '../order/order.service';
import { Request } from 'express';
import { RemoteIp } from '@/common/decorators/remote-ip.decorator';
import { OrderStatus } from '../order/const';
import { WxpayConfigType } from './dto/wxpay-config.type';
import Decimal from 'decimal.js';
import { RemoteGqlIp } from '@/common/decorators/remote-gql-ip.decorator';

@TokenEntity('student')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class WxpayResolver {
  constructor(
    private readonly studentService: StudentService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    @Inject(WECHAT_PAY_MANAGER) private wxPay: WxPay,
  ) {}

  @Mutation(() => WxpayConfigResult, { description: '获取微信支付配置' })
  async getWxpayConfig(
    @RemoteGqlIp('ip') ip: string,
    @CurrentGqlTokenId('studentId') studentId: string,
    @Args('scene') scene: string, // 支付场景, JSAPI--公众号支付、NATIVE--扫码支付、APP--APP支付
    @Args('productId') productId: string,
    @Args('quantity') quantity: number,
  ): Promise<WxpayConfigResult> {
    if (!Object.keys(SCENES).includes(scene)) {
      return {
        code: INVALID_PARAMS,
        message: CodeMsg(INVALID_PARAMS),
      };
    }

    const student = await this.studentService.findOne(studentId);
    const product = await this.productService.findOne(productId);

    if (!student) {
      return {
        code: STUDENT_NOT_EXISTS,
        message: CodeMsg(STUDENT_NOT_EXISTS),
      };
    }

    if (!student.wxOpenid) {
      return {
        code: STUDENT_HAS_NO_OPENID,
        message: CodeMsg(STUDENT_HAS_NO_OPENID),
      };
    }

    if (!product) {
      return {
        code: PRODUCT_NOT_EXISTS,
        message: CodeMsg(PRODUCT_NOT_EXISTS),
      };
    }

    // 限购
    const existingCount = await this.orderService.getCount(
      studentId,
      productId,
      product.organization.id,
    );
    if (existingCount + quantity > product.limit) {
      return {
        code: PRODUCT_LIMIT,
        message: CodeMsg(PRODUCT_LIMIT),
      };
    }

    // 库存
    if (product.stock < quantity) {
      return {
        code: PRODUCT_NOT_ENOUGH,
        message: CodeMsg(PRODUCT_NOT_ENOUGH),
      };
    }

    const amount = 1;

    // // 单位：分
    // const amount = new Decimal(product.price)
    //   .mul(100)
    //   .round()
    //   .mul(quantity)
    //   .toNumber();

    const outTraceNo = uuid().replace(/-/g, '');
    const params = {
      description: product.name,
      out_trade_no: outTraceNo,
      notify_url: `${process.env.SERVER_HOST}${process.env.SERVER_API_GLOBAL_PREFIX}/wechat/wxpayCb`,
      amount: {
        total: amount,
      },
      payer: {
        openid: student.wxOpenid,
      },
      scene_info: {
        payer_client_ip: ip,
      },
    };

    let wxconfig: Record<string, any> = {};
    switch (scene) {
      case SCENES.JSAPI:
        wxconfig = await this.wxPay.transactions_jsapi(params);
        break;

      default:
        return {
          code: NOT_IMPLEMENTED_YET,
          message: CodeMsg(NOT_IMPLEMENTED_YET),
        };
    }

    console.log('wxconfig', wxconfig);

    await this.orderService.create({
      tel: student.tel,
      outTradeNo: outTraceNo,
      quantity,
      amount,
      status: OrderStatus.USERPAYING,
      student: {
        id: studentId,
      },
      product: {
        id: productId,
      },
      organization: {
        id: product.organization.id,
      },
    });

    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: wxconfig as WxpayConfigType,
    };
  }
}
