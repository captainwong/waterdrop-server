import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Student } from '../student/entities/student.entity';
import { StudentService } from '../student/student.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student])],
  providers: [AuthService, AuthResolver, UserService, StudentService],
})
export class AuthModule {}
