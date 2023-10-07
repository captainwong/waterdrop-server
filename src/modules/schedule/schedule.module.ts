import { Module } from '@nestjs/common';
import { ScheduleResolver } from './schedule.resolver';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { ConfigModule } from '@nestjs/config';
import { Course } from '../course/entities/course.entity';
import { CourseService } from '../course/course.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Schedule, Course])],
  providers: [ScheduleResolver, ScheduleService, CourseService],
})
export class ScheduleModule {}
