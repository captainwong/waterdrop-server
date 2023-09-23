import { createResult } from '@/common/dto/result.dto';
import { ObjectType } from '@nestjs/graphql';
import { OssType } from './oss.type';

@ObjectType()
export class OssResult extends createResult(OssType) {}
