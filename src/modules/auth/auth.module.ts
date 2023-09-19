import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Student } from '../student/entities/student.entity';
import { StudentService } from '../student/student.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([User, Student]),
  ],
  providers: [
    AuthService,
    AuthResolver,
    UserService,
    StudentService,
    JwtStrategy,
  ],
})
export class AuthModule {}
