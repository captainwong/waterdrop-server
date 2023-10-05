import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Order])],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
