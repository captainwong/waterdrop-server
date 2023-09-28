import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CommonInputDto } from '@/common/dto/common-input.dto';

@InputType()
export class TeacherInputDto extends CommonInputDto {
  @Field({
    description: '姓名',
    nullable: true,
  })
  name: string;

  @Field({
    description: '照片',
    nullable: true,
  })
  photo: string;

  @Field({
    description: '教龄',
    nullable: true,
  })
  teachingAge: number;

  @Field({
    description: '学历',
    nullable: true,
  })
  education: string;

  @Field({
    description: '资历',
    nullable: true,
  })
  seniority: string;

  @Field({
    description: '职业经验',
    nullable: true,
  })
  experience: string;

  @Field({
    description: '获奖经历',
    nullable: true,
  })
  award: string;

  @Field({
    description: '风格标签，以，隔开',
    nullable: true,
  })
  tags: string;
}

@InputType()
export class PartialTeacherInputDto extends PartialType(TeacherInputDto) {}
