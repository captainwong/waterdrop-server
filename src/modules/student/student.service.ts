import { Injectable } from '@nestjs/common';
import { Student } from './entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from '@/common/dto/result.dto';
import {
  CREATE_USER_FAILED,
  SUCCESS,
  USER_ALREADY_EXISTS,
  USER_NOT_EXISTS,
  USER_NOT_EXISTS_OR_PASSWORD_NOT_MATCH,
} from '@/common/const/code';
import { compare, hash } from '@/utils/hash';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async register(account: string, password: string): Promise<Result> {
    const user = await this.studentRepository.findOne({
      where: { account: account },
    });

    if (user) {
      return {
        code: USER_ALREADY_EXISTS,
        message: 'User already exists',
      };
    }

    const newUser = await this.studentRepository.save({
      account: account,
      password: await hash(password),
    });

    if (newUser) {
      return {
        code: SUCCESS,
      };
    } else {
      return {
        code: CREATE_USER_FAILED,
        message: 'Create user failed',
      };
    }
  }

  async login(account: string, password: string): Promise<Result> {
    const user = await this.studentRepository.findOne({
      where: { account: account },
    });

    if (!user) {
      return {
        code: USER_NOT_EXISTS,
        message: 'User not exists',
      };
    }

    if (!(await compare(password, user.password))) {
      return {
        code: USER_NOT_EXISTS_OR_PASSWORD_NOT_MATCH,
        message: 'User not exists or password not match',
      };
    }

    return {
      code: SUCCESS,
    };
  }
}
