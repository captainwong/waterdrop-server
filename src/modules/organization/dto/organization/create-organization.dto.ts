import { Field, InputType } from '@nestjs/graphql';
import { CommonInputDto } from '@/common/dto/common-input.dto';
import { CreateImageDto } from '../image/create-image.dto';

@InputType()
export class CreateOrganizationDto extends CommonInputDto {
  @Field({
    description: '营业执照',
  })
  businessLicense: string;

  @Field({
    description: '法人身份证正面',
  })
  identityCardFrontImg: string;

  @Field({
    description: '法人身份证反面',
  })
  identityCardBackImg: string;

  @Field({
    description: '标签，以英文,隔开',
    nullable: true,
  })
  tags?: string;

  @Field({
    description: '简介',
    nullable: true,
  })
  desc?: string;

  @Field({
    description: '机构名称',
    nullable: true,
  })
  name?: string;

  @Field({
    description: '机构电话',
    nullable: true,
  })
  tel?: string;

  @Field({
    description: '机构地址',
    nullable: true,
  })
  address?: string;

  @Field({
    description: '经度',
    nullable: true,
  })
  longitude?: string;

  @Field({
    description: '纬度',
    nullable: true,
  })
  latitude?: string;

  @Field({
    description: 'Logo',
    nullable: true,
  })
  logo?: string;

  @Field(() => [CreateImageDto], {
    nullable: true,
    description: '门面图片',
  })
  frontImgs?: CreateImageDto[];

  @Field(() => [CreateImageDto], {
    nullable: true,
    description: '室内图片',
  })
  roomImgs?: CreateImageDto[];

  @Field(() => [CreateImageDto], {
    nullable: true,
    description: '环境图片',
  })
  otherImgs?: CreateImageDto[];
}
