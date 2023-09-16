import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()  
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly desc: string;

  @IsString()
  readonly tel: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly account: string;
}
