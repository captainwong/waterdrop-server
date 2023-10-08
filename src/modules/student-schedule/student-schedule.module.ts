import { Module } from '@nestjs/common';
import { StudentScheduleResolver } from './student-schedule.resolver';
import { StudentScheduleService } from './student-schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentSchedule } from './entities/student-schedule.entity';
import { ConfigModule } from '@nestjs/config';
import { StudentCard } from '../student-card/entities/student-card.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { StudentCardService } from '../student-card/student-card.service';
import { ScheduleService } from '../schedule/schedule.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([StudentSchedule, StudentCard, Schedule]),
  ],
  providers: [
    StudentScheduleResolver,
    StudentScheduleService,
    StudentCardService,
    ScheduleService,
  ],
})
export class StudentScheduleModule {}
