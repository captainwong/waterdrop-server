import { Injectable } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { WxorderCbType } from '../wxorder/dto/wxorder-type.dto';
import { OrderStatus } from '../order/const';
import { WxorderService } from '../wxorder/wxorder.service';
import { StudentCardService } from '../student-card/student-card.service';

@Injectable()
export class WxpayService {
  constructor(
    private readonly studentService: StudentService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly wxorderService: WxorderService,
    private readonly studentCardService: StudentCardService,
  ) {}

  async orderPaid(result: WxorderCbType): Promise<void> {
    const order = await this.orderService.findOneByOutTradeNo(
      result.out_trade_no,
    );
    if (!order) {
      console.error('order not exists', result.out_trade_no);
      return;
    }
    // TODO: 把支付成功的 outtradeno 放 redis 里，省的微信重复回调
    if (order.status !== OrderStatus.USERPAYING) {
      console.log('order status not USERPAYING', {
        out_trade_no: result.out_trade_no,
        status: order.status,
      });
      return;
    }

    // 1. find or create wxorder
    let wxorder = await this.wxorderService.findOneByTransactionId(
      result.transaction_id,
    );
    if (!wxorder) {
      wxorder = await this.wxorderService.create({
        ...result,
        ...result.payer,
        ...result.amount,
        organization: {
          id: order.organization.id,
        },
      });
    }

    // 2. 更新订单状态
    await this.orderService.update(order.id, {
      status: 'SUCCESS',
      paidAt: new Date(),
      wxorder: {
        id: wxorder.id,
      },
    });

    // 3. 更新产品的销量与库存
    await this.productService.incSalesDecStock(
      order.product.id,
      order.quantity,
    );

    // 4. 为学生添加当前商品的消费卡
    await this.studentCardService.createStudentCards(
      order.organization.id,
      order.student.id,
      order.product.cards,
    );
  }
}
