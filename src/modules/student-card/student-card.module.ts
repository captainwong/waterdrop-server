import { Module } from '@nestjs/common';
import { StudentCardResolver } from './student-card.resolver';
import { StudentCardService } from './student-card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCard } from './entities/student-card.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([StudentCard])],
  providers: [StudentCardResolver, StudentCardService],
})
export class StudentCardModule {}
