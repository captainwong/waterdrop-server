import { Module } from '@nestjs/common';
import { TeacherResolver } from './teacher.resolver';
import { TeacherService } from './teacher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Teacher])],
  providers: [TeacherResolver, TeacherService],
})
export class TeacherModule {}
