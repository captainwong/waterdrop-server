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

@Module({
  controllers: [WxpayController],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Student, Product]),
    WeChatPayModule.registerAsync({
      useFactory: async () => {
        return {
          appid: process.env.WX_PAY_APPID,
          mchid: process.env.WX_PAY_MCHID,
          publicKey: fs.readFileSync(
            process.env.WX_PAY_KEY_DIR + '/apiclient_cert.pem',
          ), // 公钥
          privateKey: fs.readFileSync(
            process.env.WX_PAY_KEY_DIR + '/apiclient_key.pem',
          ), // 秘钥
        };
      },
    }),
  ],
  providers: [WxpayResolver, StudentService, ProductService],
})
export class WxpayModule {}
