import { Field, InputType } from '@nestjs/graphql';
import { CommonInputDto } from '@/common/dto/common-input.dto';

@InputType()
export class CardInputDto extends CommonInputDto {
  @Field({
    description: '名称',
  })
  name: string;

  @Field({
    description: '类型',
  })
  type: string;

  @Field({
    description: '最大使用次数',
    nullable: true,
  })
  count: number;

  @Field({
    description: '有效天数',
  })
  duration: number;
}
