import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCourseDto } from './create-course.dto';

@InputType()
export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
