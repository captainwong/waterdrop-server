import { Module } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { ProductService } from '../product/product.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Student } from '../student/entities/student.entity';
import { WxpayController } from './wxpay.controller';
import { WxpayResolver } from './wxpay.resolver';
import { WeChatPayModule } from 'nest-wechatpay-node-v3';
import * as fs from 'fs';
import { OrderService } from '../order/order.service';
import { Order } from '../order/entities/order.entity';

@Module({
  controllers: [WxpayController],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Student, Product, Order]),
    WeChatPayModule.registerAsync({
      useFactory: async () => {
        return {
          appid: process.env.WX_PAY_APP_ID,
          mchid: process.env.WX_PAY_MCH_ID,
          publicKey: fs.readFileSync(
            process.env.WX_PAY_KEY_DIR + '/apiclient_cert.pem',
          ), // 公钥
          privateKey: fs.readFileSync(
            process.env.WX_PAY_KEY_DIR + '/apiclient_key.pem',
          ), // 秘钥
          key: process.env.WX_PAY_API_KEY, // APIv3 密钥
        };
      },
    }),
  ],
  providers: [WxpayResolver, StudentService, ProductService, OrderService],
})
export class WxpayModule {}
