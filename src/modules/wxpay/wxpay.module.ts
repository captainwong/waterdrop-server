import { Module } from '@nestjs/common';
import { StudentService } from '../student/student.service';
import { ProductService } from '../product/product.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Student } from '../student/entities/student.entity';
import { WxpayController } from './wxpay.controller';
import { WxpayResolver } from './wxpay.resolver';

@Module({
  controllers: [WxpayController],
  imports: [ConfigModule, TypeOrmModule.forFeature([Student, Product])],
  providers: [WxpayResolver, StudentService, ProductService],
})
export class WxpayModule {}
