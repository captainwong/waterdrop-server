import { Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { OssType } from './dto/oss.type';
import { OssService } from './oss.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { OssResult } from './dto/oss.result';
import { CodeMsg } from '@/common/const/message';
import { OSS_GET_SIGNATURE_ERROR, SUCCESS } from '@/common/const/code';

@Resolver()
export class OssResolver {
  constructor(private readonly ossService: OssService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => OssResult, { description: 'oss info' })
  async getOSSInfo(): Promise<OssResult> {
    try {
      const signature = await this.ossService.getSignature();
      return {
        code: SUCCESS,
        message: CodeMsg(SUCCESS),
        data: signature,
      };
    } catch (error) {
      return {
        code: OSS_GET_SIGNATURE_ERROR,
        message: CodeMsg(OSS_GET_SIGNATURE_ERROR),
      };
    }
  }
}
