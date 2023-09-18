import { Module } from '@nestjs/common';
import { OssResolver } from './oss.resolver';
import { OssService } from './oss.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [OssResolver, OssService],
})
export class OssModule {}
