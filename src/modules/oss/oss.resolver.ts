import { Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { OssType } from './dto/oss.type';
import { OssService } from './oss.service';

@Resolver()
export class OssResolver {
  constructor(private readonly ossService: OssService) {}

  @Query(() => OssType, { description: 'oss info' })
  async getOSSInfo(): Promise<OssType> {
    return this.ossService.getSignature();
  }
}
