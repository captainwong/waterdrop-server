import { Module } from '@nestjs/common';
import { WxorderResolver } from './wxorder.resolver';
import { WxorderService } from './wxorder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wxorder } from './entities/wxorder.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Wxorder])],
  providers: [WxorderResolver, WxorderService],
})
export class WxorderModule {}
