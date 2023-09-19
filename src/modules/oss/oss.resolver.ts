import { Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { OssType } from './dto/oss.type';
import { OssService } from './oss.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';

@Resolver()
export class OssResolver {
  constructor(private readonly ossService: OssService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => OssType, { description: 'oss info' })
  async getOSSInfo(): Promise<OssType> {
    return this.ossService.getSignature();
  }
}
