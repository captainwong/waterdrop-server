import { InputType, PartialType } from '@nestjs/graphql';
import { CreateImageDto } from './create-image.dto';

@InputType()
export class UpdateImageDto extends PartialType(CreateImageDto) {}
