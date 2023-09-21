import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field()
  tel: string;

  @Field()
  smsCode: string;

  @Field()
  smsCodeCreatedAt: Date;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  desc?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  account?: string;
}
