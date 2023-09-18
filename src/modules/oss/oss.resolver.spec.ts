import { Test, TestingModule } from '@nestjs/testing';
import { OssResolver } from './oss.resolver';

describe('OssResolver', () => {
  let resolver: OssResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OssResolver],
    }).compile();

    resolver = module.get<OssResolver>(OssResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
